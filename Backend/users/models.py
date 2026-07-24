# Farmer profile data now lives in Firestore (collection: "farmer_profiles",
# document ID = Firebase Auth uid) instead of a Django model — see
# smartgrow/firebase_config.py and users/views.py.
#
# This file is intentionally left without models. The `users` app stays
# registered in INSTALLED_APPS so its views/urls/authentication continue to work.