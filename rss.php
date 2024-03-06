<?php
    header('Content-Type: application/json');

    //Feed URLs
    $feeds = array(
        "https://news.google.com/rss?topic=h&hl=en-US&gl=US&ceid=US:en",
        "https://www.espncricinfo.com/rss/content/story/feeds/6.xml"
    );

    //Read the items in each feed
    $entries = array();
    foreach($feeds as $feed) {
        $xml = simplexml_load_file($feed);
        $entries = array_merge($entries, $xml->xpath("//item"));
    }

    //Sort feed entries by pubDate
    usort($entries, function ($feed1, $feed2) {
        return strtotime($feed2->pubDate) - strtotime($feed1->pubDate);
    });

    echo json_encode($entries);
?>