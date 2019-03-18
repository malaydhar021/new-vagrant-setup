<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class SubscriptionCreated extends Notification
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
     * Is trailing subscription
     *
     * @var boolean
     */
    protected $isTrialing;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($name, $plan, $isTrialing = false)
    {
        $this->name = $name;
        $this->plan = $plan;
        $this->isTrialing = $isTrialing;
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
        $message = "You have successfully subscribed to " . config("pricing.plans.{$this->plan}.alias") . " plan.";
        if ($this->isTrialing) {
            $message .= " You are currently on " . config('pricing.plans.lowest.trial') . " days free trial. We will not"
                . " charge you until trial peroid is over. However you can cancel anytime.";
        } else {
            $message .= " Your subscription will valid for next 30 days. You will be charged once on every 30 days"
                . " cycle. To enjoy uninterrupted and hassle free services please register a valid and working card.";
        }

        return (new MailMessage)
            ->from($this->from)
            ->subject('Sticky Reviews Subscription Created')
            ->greeting("Hello {$this->name},")
            ->line($message)
            ->line("Thanks for subscribing, we hope you will enjoy using the power of reviews to make your business fly.");
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
