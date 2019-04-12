<?php

namespace App\Traits;

use DateTime;

use FFMpeg\FFMpeg;
use FFMpeg\Format\Audio\Mp3;

use Illuminate\Http\File;
use Illuminate\Http\UploadedFile;
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
        return $this->saveFile(Image::make($imageFile)->resize(256, 256)->encode('png', 100), "image");
    }

    /**
     * Converts and saves a recorded audio file to `mp3`
     *
     * @param \Illumiate\Http\File $audioFile  The File Object, in this case an audio file
     * @return string
     */
    public function saveAudioFile($audioFile)
    {
        // $actualFileExtension = pathinfo($audioFile->getClientOriginalName(), PATHINFO_EXTENSION);

        // $uniqueName = (new DateTime())->getTimestamp();
        // $tempAudioFileName = strlen(trim($actualFileExtension)) ? $uniqueName . "." . $actualFileExtension : $uniqueName;
        // $newAudioFileName = $uniqueName . ".mp3";

        // $path = config('filepaths.audio');
        // Storage::put($path . $tempAudioFileName, file_get_contents($audioFile));

        // if ($actualFileExtension != 'mp3') {
        //     /** Convert audio file with MPEG-3 layer using `mp3` container */
        //     $audio = (FFMpeg::create())->open(getcwd() . "/public/storage/" . $path . $tempAudioFileName);
        //     $audio->save(new Mp3(), getcwd() . "/public/storage/" . $path . $newAudioFileName);

        //     $this->deleteAudioFile($tempAudioFileName);
        // }

        // return $newAudioFileName;
        return $this->saveFile($audioFile, "audio");
    }


    /**
     * Converts and saves a recorded video file to `mp4`
     *
     * @param \Illumiate\Http\File $videoFile  The File Object, in this case an audio file
     * @return string
     */
    public function saveVideoFile($videoFile)
    {
        // $actualFileExtension = pathinfo($videoFile->getClientOriginalName(), PATHINFO_EXTENSION);

        // $uniqueName = (new DateTime())->getTimestamp();
        // $tempVideoFileName = strlen(trim($actualFileExtension)) ? $uniqueName . "." . $actualFileExtension : $uniqueName;
        // $newVideoFileName = $uniqueName . ".mp4";

        // $path = config('filepaths.audio');
        // Storage::put($path . $tempVideoFileName, file_get_contents($videoFile));

        // if ($actualFileExtension != 'mp4') {
        //     /** Convert audio file with MPEG-4 layer using `mp4` container */
        //     $audio = (FFMpeg::create())->open(getcwd() . "/public/storage/" . $path . $tempVideoFileName);
        //     $audio->save(new Mp3(), getcwd() . "/public/storage/" . $path . $newVideoFileName);

        //     $this->deleteVideoFile($tempVideoFileName);
        // }

        // return $newVideoFileName;
        return $this->saveFile($videoFile, "video");
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
            case "application/x-mpegurl":
                return ".m3u8";
            case "audio/mp4":
                return ".mp4";
            case "audio/mpeg":
                return ".mp3";
            case "audio/ogg":
                return ".ogg";
            case "audio/webm":
                return ".webm";
            case "audio/vorbis":
                return ".ogg";
            case "audio/vnd.wav":
                return ".wav";
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
            case "video/mp2t":
                return ".ts";
            case "video/ogg":
                return ".ogg";
            case "video/quicktime":
                return ".mov";
            case "video/webm":
                return ".webm";
            case "video/x-msvideo":
                return ".avi";
            case "video/x-ms-wmv":
                return ".wmv";
            default:
                return "";
        }
    }
}
