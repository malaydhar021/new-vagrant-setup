<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class SubscriptionUpdated extends Notification
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
     * The plan name
     *
     * @var string
     */
    protected $plan;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($name, $plan)
    {
        $this->name = $name;
        $this->plan = $plan;
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
        $message = "You have successfully changed your subscription to " . config("pricing.plans.{$this->plan}.alias")
            . " plan. From today onwards you will be charged " . config("pricing.currency.symbol")
            . config("pricing.plans.{$this->plan}.amount") . " for the new plan. The billing cycle will be same as "
            . "previous which on every 30 days. Remember to enjoy uninterrupted and hassle free services you need a "
            . "valid and working card.";

        $warningMessage = "If you did changed your subscription, no further action is required. If you did not, please "
            . "protect your account now.";

        return (new MailMessage)
            ->from($this->from)
            ->subject('Sticky Reviews Subscription Changed')
            ->greeting("Hello {$this->name},")
            ->line($message)
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
