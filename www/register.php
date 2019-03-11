<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>

<body>

    <form action="" method="post" style="display: flex; flex-direction: column;">
        <input type="text" name="password" id="password" />
        <label for="card-no">Card Number</label>
        <input type="text" name="card_number" id="card-no" />
        <label for="cvc-no">CVC Number</label>
        <input type="text" name="cvc_number" id="cvc-no" />
        <label for="exp-month">Expiry Month</label>
        <select name="expiry_month" id="exp-month">
            <?php for ($month = 1; $month <= 12; $month++) { ?>
            <option value="<?= $month ?>"><?= $month ?></option>
            <?php 
        } ?>
        </select>
        <label for="exp-year">Expiry Year</label>
        <select name="expiry_year" id="exp-year">
            <?php
            $year = date('Y');
            while ($year <= date('Y') + 19) { ?>
            <option value="<?= $year ?>"><?= $year++ ?></option>
            <?php 
        } ?>
        </select>
        <button type="submit" id="stripe-subscription">Register</button>
    </form>

    <script src="https://checkout.stripe.com/checkout.js"></script>

    <script>
        var handler = StripeCheckout.configure({
            key: 'pk_test_TvyjA9HRjjW8MBPv4Sjp0UtL',
            image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
            locale: 'auto',
            token: function(token) {
                // You can access the token ID with `token.id`.
                // Get the token ID to your server-side code for use.
            }
        });

        document.getElementById('customButton').addEventListener('click', function(e) {
            // Open Checkout with further options:
            handler.open({
                name: 'Stripe.com',
                description: '2 widgets',
                zipCode: true,
                amount: 2000
            });
            e.preventDefault();
        });

        // Close Checkout on page navigation:
        window.addEventListener('popstate', function() {
            handler.close();
        });
    </script>

</body>

</html> 