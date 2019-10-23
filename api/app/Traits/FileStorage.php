<?php

/**
 * Trait to handle all sort operations releted to file
 * @package FileStorage
 * @version 2.0.0
 * @author Tier5 LLC <work@tier5.us>
 * @license Proprietary
 */

namespace App\Traits;

use Aws\S3\MultipartUploader;
use Aws\Exception\MultipartUploadException;
use App\Exceptions\FileStoringException;
use Exception;
use FFMpeg;
use FFMpeg\Format\Audio\Mp3;
use FFMpeg\Format\Video\X264;
use Illuminate\Http\File;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

trait FileStorage
{
    /**
     * Saves a file into storage disk
     *
     * @param \Illumiate\Http\File $file  The File Object
     * @return string
     */
    private function saveFile($file, $type)
    {
        switch (get_class($file)) {
            case UploadedFile::class:
            case File::class:
                $extension = $this->getFileExtensionFromMime($file->getClientMimeType());
                $fileStream = file_get_contents($file->getRealPath());
                break;
            default:
                $extension = $this->getFileExtensionFromMime($file->mime());
                $fileStream = $file->__toString();
        }

        $fileName = sha1(microtime()) . $extension;

        if ($type === 'audio' && Storage::disk('local')->put(config('filepaths')[$type] . $fileName, $fileStream)) return $fileName;
        if ($type === 'video' && Storage::disk('local')->put(config('filepaths')[$type] . $fileName, $fileStream)) return $fileName;
        if (Storage::disk('s3')->put(config('filepaths')[$type] . $fileName, $fileStream)) return $fileName;

        return null;
    }


    /**
     * Method to upload file to AWS s3 cloud
     * @since 2.0.0
     * @param type $file \Illumiate\Http\File
     * @param type $fileType File type (audio | video)
     * @return string File name which has been uploaded
     */
    private function uploadFile($fileName, string $fileType) {
        try {
            $disk = Storage::disk('s3');
            $uploader = new MultipartUploader($disk->getDriver()->getAdapter()->getClient(), config("filesystems.disks.$fileType.root") . '/' . $fileName, [
                'bucket'          => config('filesystems.disks.s3.bucket'),
                'key'             => config('filepaths')[$fileType] . $fileName,
                'concurrency'     => 25,
            ]);
            $result = $uploader->upload();

            return $fileName;
        } catch (MultipartUploadException $exception) {
            Log::error("S3 Multipart Uploading Error: ", $exception->getTrace());

            throw new FileStoringException($exception->getMessage());
        } catch (Exception $exception) {
            Log::error("S3 Other Uploading Error: ", $exception->getTrace());

            throw new FileStoringException(
                "An error occurred during uploading the file, either check the file is valid or please try again later."
            );
        }
    }

    /**
     * Saves an image file
     *
     * @param \Illumiate\Http\File $imageFile  The File Object, in this case an image file
     * @return string
     */
    public function saveImageFile($imageFile)
    {
        try {
            return $this->saveFile(Image::make($imageFile)->resize(256, 256)->encode('png', 100), "image");
        } catch (Exception $exception) {
            Log::error("Audio Conversion Error: ", $exception->getTrace());

            throw new FileStoringException(
                "An error occurred during uploading the image, either check the file is valid or please try again later."
            );
        }
    }

    /**
     * Converts and saves a recorded audio file to `mp3`
     *
     * @param \Illumiate\Http\File $audioFile  The File Object, in this case an audio file
     * @return string
     */
    public function saveAudioFile($audioFile)
    {
        $originalFileName = $this->saveFile($audioFile, "audio");

        try {
            $convertedFileName = sha1(microtime()) . '.mp3';

            FFMpeg::fromDisk('audio')
                ->open($originalFileName)
                ->export()
                ->toDisk('audio')
                ->inFormat(new Mp3)
                ->save($convertedFileName);
            // upload file to s3
            $this->uploadFile($convertedFileName, "audio");
            // delete local files
            $this->deleteLocalFile($originalFileName, 'audio');
            $this->deleteLocalFile($convertedFileName, 'audio');

            return $convertedFileName;
        } catch (Exception $exception) {
            Log::error("Audio Conversion Error: ", $exception->getTrace());

            $this->deleteAudioFile($originalFileName);
            $this->deleteLocalFile($originalFileName, 'audio');

            throw new FileStoringException(
                "An error occurred during uploading the audio, either check the file is valid or please try again later."
            );
        }
    }

    /**
     * Converts and saves a recorded video file to `mp4`
     *
     * @param \Illumiate\Http\File $videoFile  The File Object, in this case an audio file
     * @return string
     */
    public function saveVideoFile($videoFile)
    {
        $originalFileName = $this->saveFile($videoFile, "video");

        try {
            $convertedFileName = sha1(microtime()) . '.mp4';

            FFMpeg::fromDisk('video')
                ->open($originalFileName)
                ->export()
                ->toDisk('video')
                ->inFormat(new X264('libmp3lame', 'libx264'))
                ->save($convertedFileName);
            // upload video file to s3
            $this->uploadFile($convertedFileName, "video");
            // delete local files
            $this->deleteLocalFile($originalFileName, 'video');
            $this->deleteLocalFile($convertedFileName, 'video');

            return $convertedFileName;
        } catch (Exception $exception) {
            Log::error("Video Conversion Error: ", $exception->getTrace());

            $this->deleteVideoFile($originalFileName);
            $this->deleteLocalFile($originalFileName, 'video');

            throw new FileStoringException(
                "An error occurred during uploading the video, either check the file is valid or please try again later."
            );
        }
    }

    /**
     * Get a file's URI
     *
     * @param string $fileName
     * @param string $type
     * @return string
     */
    private function getFileURI($fileName, $type)
    {
        // return $fileName ? Storage::url(config('filepaths')[$type] . $fileName) : null;  // local storage
        if($type == 'video') {
            return  $fileName ? config('services.cloudfront_cdn_url.video_cdn_url').$fileName : null;
        }
        return $fileName ? Storage::disk('s3')->url(config('filepaths')[$type] . $fileName) : null;  // s3 bucket
    }

    /**
     * Get an image file's URI
     *
     * @param string $fileName
     * @return string
     */
    public function getImageFileURI($fileName)
    {
        return $this->getFileURI($fileName, "image");
    }

    /**
     * Get an audio file's URI
     *
     * @param string $fileName
     * @return string
     */
    public function getAudioFileURI($fileName)
    {
        return $this->getFileURI($fileName, "audio");
    }

    /**
     * Get an video file's URI
     *
     * @param string $fileName
     * @return string
     */
    public function getVideoFileURI($fileName)
    {
        return $this->getFileURI($fileName, "video");
    }

    /**
     * Deletes a stored file
     *
     * @param string $fileName
     * @param string $type
     * @return boolean
     */
    private function deleteFile($fileName, $type)
    {
        return Storage::disk('s3')->delete(config('filepaths')[$type] . $fileName);
    }

    /**
     * Deletes a stored file
     *
     * @param string $fileName
     * @param string $type
     * @return boolean
     */
    private function deleteLocalFile($fileName, $type)
    {
        return Storage::disk('local')->delete(config('filepaths')[$type] . $fileName);
    }

    /**
     * Deletes a stored image file
     *
     * @param string $fileName
     * @return boolean
     */
    public function deleteImageFile($fileName)
    {
        return $this->deleteFile($fileName, "image");
    }

    /**
     * Deletes a stored audio file
     *
     * @param string $fileName
     * @return boolean
     */
    public function deleteAudioFile($fileName)
    {
        return $this->deleteFile($fileName, "audio");
    }

    /**
     * Deletes a stored video file
     *
     * @param string $fileName
     * @return boolean
     */
    public function deleteVideoFile($fileName)
    {
        return $this->deleteFile($fileName, "video");
    }

    /**
     * Get file extension from a MIME type
     *
     * @param  string  $mime
     * @return string
     */
    private function getFileExtensionFromMime($mime)
    {
        switch (strtolower($mime)) {
            case "application/ogg":
                return ".ogg";
            case "audio/amr":
                return ".amr";
            case "audio/mp4":
                return ".mp4";
            case "audio/mpeg":
                return ".mp3";
            case "audio/ogg":
                return ".ogg";
            case "audio/vorbis":
                return ".ogg";
            case "audio/vnd.wav":
                return ".wav";
            case "audio/wav":
            case "audio/wave":
                return ".wav";
            case "audio/webm":
                return ".webm";
            case "audio/x-aac":
                return ".aac";
            case "audio/x-ms-wma":
                return ".wma";
            case "audio/x-matroska":
                return ".mka";
            case "audio/x-mpegurl":
                return ".m3u";
            case "image/gif":
                return ".gif";
            case "image/jpeg":
                return ".jpg";
            case "image/png":
                return ".png";
            case "image/tiff":
                return ".tiff";
            case "image/x-icon":
                return ".ico";
            case "image/x-ms-bmp":
                return ".bmp";
            case "image/webp":
                return ".webp";
            case "video/3gpp":
                return ".3gp";
            case "video/mp4":
                return ".mp4";
            case "video/mpeg":
                return ".mpg";
            case "video/ogg":
                return ".ogg";
            case "video/quicktime":
                return ".mov";
            case "video/webm":
                return ".webm";
            case "video/x-flv":
                return ".flv";
            case "video/x-msvideo":
                return ".avi";
            case "video/x-ms-wmv":
                return ".wmv";
            default:
                return "";
        }
    }
}
