<?php

namespace App\Traits;

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

        if (Storage::put(config('filepaths')[$type] . $fileName, $fileStream)) return $fileName;

        return null;
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
                "An error occured during uploading the image, either check the file is valid or please try again later."
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

            $this->deleteAudioFile($originalFileName);

            return $convertedFileName;
        } catch (Exception $exception) {
            Log::error("Audio Conversion Error: ", $exception->getTrace());

            $this->deleteAudioFile($originalFileName);

            throw new FileStoringException(
                "An error occured during uploading the audio, either check the file is valid or please try again later."
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

            $this->deleteVideoFile($originalFileName);

            return $convertedFileName;
        } catch (Exception $exception) {
            Log::error("Video Conversion Error: ", $exception->getTrace());

            $this->deleteAudioFile($originalFileName);

            throw new FileStoringException(
                "An error occured during uploading the video, either check the file is valid or please try again later."
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
        return $fileName ? Storage::url(config('filepaths')[$type] . $fileName) : null;
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
        return Storage::delete(config('filepaths')[$type] . $fileName);
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
