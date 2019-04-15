<?php

namespace App\Notifications;

use Carbon\Carbon;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class PasswordUpdated extends Notification
{
    use Queueable;

    /**
     * The application name
     *
     * @var string
     */
    protected $appName;

    /**
     * The user's name
     *
     * @var string
     */
    protected $name;

    /**
     * The user's password update time
     *
     * @var string
     */
    protected $updateTime;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($name, $updateTime)
    {
        $this->appName = config('app.name');
        $this->name = $name;
        $this->updateTime = Carbon::parse($updateTime)->toDayDateTimeString();
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject("Your {$this->appName} password has changed")
            ->greeting("Hello {$this->name},")
            ->line("Your password has been changed at {$this->updateTime}.")
            ->line("No further action is required if you changed. If you did not, please secure your account now.");
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
