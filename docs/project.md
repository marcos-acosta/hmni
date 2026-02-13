# HMNI

This app is designed for street art enthusiasts to catalog stickers they see around the city. Its key feature revolves around its logging feature, where the user can log a sticker just by taking a picture. Other features include seeing a map of logged stickers (optionally, for a single design), seeing their own list of logged stickers, and searching for a particular sticker.

## Terminology

- Sticker: A physical sticker that has a location in the real world.
- Design: A way to refer to a sticker design, abstracted from the stickers' locations. A sticker is an instance of a design.

## Key CUJs for MVP

- Sign up / log in
  - Create credentials with email & password, then choose unique username
- Log sticker (must be logged in)
  - Take picture using built-in camera (cannot upload photo)
  - User roughly outlines sticker to improve segmentation
  - User is shown a list of potentially similar designs from the db, ask user if the sticker is any of those designs
    - If yes (existing design)
      - If db has stickers of that design that were found within X miles of the user's photo, ask user if it is one of those
        - Why? Helps dedupe multiple photos of the exact same sticker, otherwise map view will become cluttered with duplicates
    - If no (new design):
      - User chooses name and description (alt text) for design
  - User may add an optional note
  - Afterward, user is brought to the sticker's detail page
- Browse designs
  - Can scroll through all logged designs
  - Clicking on a design brings user to design detail page
- Map view
  - Map of all logged stickers
  - Clicking on sticker brings user to sticker detail page
- Design detail page
  - Shows name, description, and photo gallery of that design
  - Can also switch to map view to see location of every logged sticker
  - Clicking on a sticker brings user to sticker detail page
- Sticker detail page
  - Show larger image, user, date, and location on map
  - Can go back to design detail page, or click on user to go to user detail page
- User detail page
  - Shows username, date joined, number of stickers logged, number of new designs added
  - Show timeline view of the stickers they logged
    - Clicking on sticker / design brings user to respective sticker / design detail page
- Design search
  - Search for designs with text
  - Clicking on design brings user to design detail page
- User search
  - Search for users by username
  - Clicking on user brings user to user detail page

The MVP should be _minimally styled_. I want to design it to look very idiosyncratic later, so for now, the design should be solely functional and bare-bones.

## Technical details

I generally want to use Cloudflare when possible. The database structure should probably be NoSQL, with stickers nested within designs. For image processing, I'm thinking of using the user's rough outline to generate a bounding box, and then running mobile SAM to segment it. Future iterations can improve upon this by letting the user add include/exclude points. For the design similarity search, I was thinking about running CLIP, since it seems to be related to Replicate which joined Cloudflare? I'm not sure of the exact details.