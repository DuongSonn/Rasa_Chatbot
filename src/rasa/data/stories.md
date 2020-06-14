## sad path 2
* greet
  - utter_greet
* mood_unhappy
  - utter_cheer_up
* done_playing
  - utter_did_that_help
* deny
  - utter_goodbye
  
## happy path 2
* greet
  - utter_greet
* mood_great
  - utter_happy
* done_playing
  - utter_play_again
* goodbye
  - utter_goodbye
  
## say goodbye
* goodbye
  - utter_goodbye

## bot challenge
* bot_challenge
  - utter_iamabot
  
## bot play music 1
* greet
  - utter_greet
* play_music
  - utter_ask_for_song
* user_song{"song_name": "The Night"}
  - slot{"song_name": "The Night"}
  - get_user_song
* done_playing
  - utter_play_again
* affirm
  - cofirm_play_again
* goodbye
  - utter_goodbye
  
## bot play music 2
* greet
  - utter_greet
* play_music
  - utter_ask_for_song
* user_song{"song_name": "Now or never"}
  - slot{"song_name": "The Night"}
  - get_user_song
* done_playing
  - utter_play_again
* deny
  - utter_goodbye

## bot play music 3
* greet
  - utter_greet
* play_music
  - utter_ask_for_song
* user_song{"song_name": "The Night"}
  - slot{"song_name": "The Night"}
  - get_user_song
* done_playing
  - utter_play_again
* play_again
  - cofirm_play_again
* goodbye
  - utter_goodbye

## bot play music 4
* done_playing
  - utter_play_again

