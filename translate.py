# Imports the Google Cloud client library
from google.cloud import translate

def translate_text(input_text, target_lang = 'Portuguese'):
    # Instantiates a client
    translate_client = translate.Client()

    # The text to translate
    text = input_text

    #get language code
    results = translate_client.get_languages()
    lang_code = next(item for item in results if item["name"] == target_lang)['language']

    # Translates some text
    translation = translate_client.translate(
        text,
        target_language=lang_code)

    return translation['translatedText']

