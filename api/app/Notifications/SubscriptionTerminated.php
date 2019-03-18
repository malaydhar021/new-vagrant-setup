<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class SubscriptionTerminated extends Notification
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
        $resubscriptionURL = env('REDIRECT_URL', 'app.usestickyreviews.com') . "/dashboard/plans";
        $message = "Attention! last payment attempt from card got declined and as a result your subscription is "
            . "terminated and serive is no longer available. However, your users or customers or clients can leave a "
            . "review through review links but will not able to see them until you are resubscribing again with a "
            . "valid card. Please re-subscribe now to resume your service.";
        $infoMessage = "Your card may not have balance or got expired. Please update the before re-subscribing.";

        return (new MailMessage)
            ->from($this->from)
            ->subject('Your Subscription is Terminated')
            ->greeting("Hello {$this->name},")
            ->line($message)
            ->action("Re-subscribe Now", $resubscriptionURL)
            ->line($infoMessage);
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
