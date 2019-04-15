<?php

namespace App\Traits;

use DateTime;

use FFMpeg\FFMpeg;
use FFMpeg\Format\Audio\Mp3;

use Illuminate\Support\Facades\Storage;

trait FileStorage
{
    /**
     * Saves a file
     *
     * @param \Illumiate\Http\UploadedFile $file  The File Object
     * @return string
     */
    private function saveFile($file, $type)
    {
        $actualFileExtension = pathinfo($file->getClientOriginalName(), PATHINFO_EXTENSION);

        $uniqueName = (new DateTime())->getTimestamp();
        $newFileName = strlen(trim($actualFileExtension)) ? $uniqueName . "." . $actualFileExtension : $uniqueName;
        Storage::disk(config('filesystems.driver'))->put(config('filepaths')[$type] . $newFileName, $file);

        return $newFileName;
    }

    /**
     * Saves an image file
     *
     * @param \Illumiate\Http\UploadedFile $imageFile  The File Object, in this case an image file
     * @return string
     */
    public function saveImageFile($imageFile)
    {
        return $this->saveFile($imageFile, "image");
    }

    /**
     * Converts and saves a recorded audio file to `mp3`
     *
     * @param \Illumiate\Http\UploadedFile $audioFile  The File Object, in this case an audio file
     * @return string
     */
    public function saveAudioFile($audioFile)
    {
        $actualFileExtension = pathinfo($audioFile->getClientOriginalName(), PATHINFO_EXTENSION);

        $uniqueName = (new DateTime())->getTimestamp();
        $tempAudioFileName = strlen(trim($actualFileExtension)) ? $uniqueName . "." . $actualFileExtension : $uniqueName;
        $newAudioFileName = $uniqueName . ".mp3";

        $path = config('filepaths.audio');
        Storage::disk(config('filesystems.driver'))->put($path . $tempAudioFileName, file_get_contents($audioFile));

        if ($actualFileExtension != 'mp3') {
            /** Convert audio file with MPEG-3 layer using `mp3` container */
            $audio = (FFMpeg::create())->open(getcwd() . "/public/storage/" . $path . $tempAudioFileName);
            $audio->save(new Mp3(), getcwd() . "/public/storage/" . $path . $newAudioFileName);

            $this->deleteAudioFile($tempAudioFileName);
        }

        return $newAudioFileName;
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
        return Storage::disk(config('filesystems.driver'))->url(config('filepaths')[$type] . $fileName);
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
     * Deletes a stored file
     *
     * @param string $fileName
     * @param string $type
     * @return boolean
     */
    private function deleteFile($fileName, $type)
    {
        $parts = explode("/", $fileName);
        return Storage::disk(config('filesystems.driver'))->delete(config('filepaths')[$type] . end($parts));
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
}
