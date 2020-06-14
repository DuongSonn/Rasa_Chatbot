# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/core/actions/#custom-actions/


# This is a simple example for a custom action which utters "Hello World!"

# from typing import Any, Text, Dict, List
#
# from rasa_sdk import Action, Tracker
# from rasa_sdk.executor import CollectingDispatcher
#
#
# class ActionHelloWorld(Action):
#
#     def name(self) -> Text:
#         return "action_hello_world"
#
#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#
#         dispatcher.utter_message(text="Hello World!")
#
#         return []
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet

class ActionPlayMusic(Action):
    def name(self):
        return "get_user_song"
        
    def run(self, dispatcher, tracker, domain):
        user_song = tracker.get_slot('song_name')
        dispatcher.utter_message(text="-p" + user_song)
        print(user_song)
        return [SlotSet("song_name", user_song)]
        
class ActionConfirmPlayAgain(Action):
    def name(self):
        return "cofirm_play_again"
        
    def run(self, dispatcher, tracker, domain):
        return dispatcher.utter_message(text="-again")