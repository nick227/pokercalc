<!doctype html>
<html class="no-js" lang="">
    <head>
        <meta charset="utf-8">

        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>POKER CALCULATOR</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <link rel="shortcut icon" href="img/heart.png" />
        <link href="https://fonts.googleapis.com/css?family=Roboto+Condensed" rel="stylesheet">
    </head>
    <body>

        <div class="visible-cards">
            <div id="cards-hole" class="hole-cards "></div>
            <div id="cards-table" class="table-cards "></div>
        </div>
        <div class="syslog"></div>
        <div class="controls">
            <button class="btn deal">deal (n)</button>
            <button class="btn raise">raise (r)</button>
            <button class="btn fold">fold (f)</button>
            <button class="btn check">check (c)</button>
            <input type="number" class="amount" placeholder="bet amount">
        </div>
        <div class="legend row">
            <h3>Legend:</h3>
            <ul>
            <li>[n]ew deal</li>
            <li>[r]aise</li>
            <li>[f]old</li>
            <li>cal[l]</li>
            <li>chec[k]</li>
            </ul>
            <ul>
            <li>2-9: 2-9</li>
            <li>[t]en</li>
            <li>[j]ack</li>
            <li>[q]ueen</li>
            <li>[k]ing</li>
            <li>[a]ce</li>
            </ul>
            <ul>
            <li>[h]earts</li>
            <li>[d]iamonds</li>
            <li>[c]lubs</li>
            <li>[s]pades</li>

            </ul>
        </div>
        <div id="cards-container" class="deck-cards"></div>
        <div class="info-box "></div>
        <link rel="stylesheet" type="text/css" href="style.css?v=<?php echo mt_rand(0, 999939); ?>">
        <script src="js/prob.js?v=<?php echo mt_rand(0, 999939); ?>"></script>
        <script src="js/main.js?v=<?php echo mt_rand(0, 999939); ?>"></script>
    </body>
</html>