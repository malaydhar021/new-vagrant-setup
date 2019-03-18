<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class SubscriptionTrialWillEnd extends Notification
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
        $message = "A reminder that your trialing subscription will end withing three days, and you will be charged "
            . "for first time. Your subscription will valid for next 30 days. You will be charged once on every 30 days"
            . " cycle. To enjoy uninterrupted and hassle free services please register a valid and working card.";

        return (new MailMessage)
            ->from($this->from)
            ->subject('Sticky Reviews Subscription Trial Will End')
            ->greeting("Hello {$this->name},")
            ->line($message);
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
