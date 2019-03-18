<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class SubscriptionDeleted extends Notification
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
        $message = "You have successfully cancelled your subscription. You can no longer access any our services, "
            . "which does not include taking reviews from your valuable users or customers or clients. However, if you "
            . "wish to continue our service you can re-subscribe back anytime in future and can resume from where you "
            . "have left off.";

        $warningMessage = "If you did cancelled your subscription, no further action is required. If you did not, "
            . "please protect your account now.";

        return (new MailMessage)
            ->from($this->from)
            ->subject('Sticky Reviews Subscription Cancelled')
            ->greeting("Hello {$this->name},")
            ->line($message)
            ->line("Sorry, you had to cancel your subscription. We hope to see you in future.")
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
