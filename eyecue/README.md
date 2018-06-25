# The Hot Button

### By Andy Grossberg and Jared Clemmensen

## Description
An IOT application for stress management. Users will pair the device with their smartphone and when stressed click the button. The app will keep track of how many clicks and when and chart it for the user. The hope is that users will be able to gain useful insights about their stressful moments based on matching the available data to their experiences.

## Objectives

**Phase One Objectives**
- To create an app that will measure user clicks from a software button.

* User can press a button to record a timestamp
* User can create a profile to store their button presses
* User can chart button presses stored in their profile
* Once the device exists, if paired, the application ignores the software button in favor of the hardware click

**Phase Two Objectives**
- To create a piece of smart hardware that can take user clicks from a button and send timestamps via bluetooth to a paired app.

* User can turn on device and pair with the app on their smartphone
* User can click a button on the device
* User clicks are sent as timestamps to the paired smartphone

**Like to haves**
- These are the things that we'd like to add to the experience if we have time.

* A series of fortune cookie-sized data nuggets and suggestions for the user about stress management
* A website where users can get more links and information regarding stress management
* The ability for users to create more than one identity on the application

### Application Specs

**Firebase for authentication?**
**Product**
**Testing**
**Styling**

## User Stories
On a typical day people get pretty stressed with few ways to subtly express it. The fidget cube was an ingenious device designed as a way for people to focus their stress into dexterous busywork with their fingers. Now the Hot Button gives users a way to discretely stress and gain useful insights from their actions.

To use The Hot Button a user need only launch the cross-platform app and pair the device with their smartphone. Then when stressed they can click the nice button as a focus for their energy much as people once clicked ballpoint pens to alleviate their distress.

The Hot Button will chart the user's clicks and allow them to study over their personal metrics, offering insights into when they were stressed and by how much. Combining this information with the user's event recall will allow them to get a better handle on the when's and maybe the why's of their stress.  

**All Users**
* A user should be able to click a button on the application that sends a timestamp to a dB
* A user should be able to make a profile for storing their clicks
* A user should able to check a chart of their clicks over time via their profile
  - The chart should have Minute, Hour, Day, Week, Month, Year, and All.
* A user should be able to make more than one profile
* A user should be able to delete any profile
* A user should be able to access small informative declarations about general stress and suggestions for alleviating it
* A user should be able to pair the hardware device to their smartphone to use its button
* A user should be able to use the hardware button in all the ways mentioned above that the software button can be used

## Specifications
* Click object created (an array?)
* Click object can receive and store timestamps
* Click object timestamps are retrievable (display to console?)
* User profile object created
* User can be associated with click object
* Button created
* Button can be clicked
* Button generates a timestamp on click
* Button click timestamps are stored in the click object
* Database for users?
* User CRUD
* A user should able to check a chart of their clicks over time via their profile
  - The chart should have Minute, Hour, Day, Week, Month, Year, and All.
* A user should be able to make more than one profile
* A user should be able to access small informative declarations about general stress and suggestions for alleviating it
* A user should be able to pair the hardware device to their smartphone to use its button
* A user should be able to use the hardware button in all the ways mentioned above that the software button can be used
* Pretty up the UI
* Refactor code as needed.

## Methodology and Comments

## Technologies Used

* Android Studio
* IOS / Swift or Xcode
* Javascript
* React Native
* Firebase

## Dependencies and plugins

**Dependencies**
TBD

## Setup/Installation Requirements
Clone the repository from https://github.com/agro23/hotbutton

## Future expansion

## Known Bugs and Issues

## Support and contact details

**Contact the authors at andy.grossberg@gmail.com or jaredclemmensen@gmail.com**

## License
Licensed for use under the GNU GPL. (c) 2018 Andy Grossberg & Jared Clemmensen
