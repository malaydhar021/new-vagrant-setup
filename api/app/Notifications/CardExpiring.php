<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class CardExpiring extends Notification
{
    use Queueable;

    /**
     * The from e-mail address
     *
     * @var string
     */
    protected $from;

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
    public function __construct($name)
    {
        $this->name = $name;
        $this->from = env('MAIL_FROM_ADDRESS_FOR_PAYMENT', 'payment@usestickyreviews.com');
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
        $cardUpdateURL = env('REDIRECT_URL', 'app.usestickyreviews.com') . "/dashboard/update-payment-info";
        $message = "Attention! your card is going to expire after this month. For uninterrupted service please "
            . "update your card now.";
        $warningMessage = "An expired card or payment failure will lead to termination of your subscription and "
            . "discontinuation of the service.";

        return (new MailMessage)
            ->from($this->from)
            ->subject('Your Card Will Expire')
            ->greeting("Hello {$this->name},")
            ->line($message)
            ->action("Update Card Now", $cardUpdateURL)
            ->line($warningMessage);
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
