<?php

namespace App\Observers;

class UserObserver
{
    /**
     * Handle the User "deleted" event.
     *
     * @param  \App\User  $user
     * @return void
     */
    public function deleting(User $user)
    {
        // Delete all locally stored subscriptions attached to an user
        foreach ($user->localSubscriptions as $localSubscription) {
            $localSubscription->delete();
        }
    }
}
