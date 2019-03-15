<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PasswordResetRequest extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The password reset token
     *
     * @var string
     */
    protected $token;

    /**
     * The user's name
     *
     * @var string
     */
    protected $name;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($token, $name)
    {
        $this->token = $token;
        $this->name = $name;
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
        $url = env('PASSWORD_RESET_URL') . $this->token;

        return (new MailMessage)
                ->subject('Password Reset Request')
                ->greeting("Hello {$this->name},")
                ->line("You are receiving this email because we received a password reset request for your account.")
                ->action("Reset Password", $url)
                ->line("If you did not request a password reset, no further action is required.");
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
