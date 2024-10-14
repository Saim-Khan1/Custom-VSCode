# Custom-VSCode
A custom Visual Studio Code setup based on Xcode on macOS

![CleanShot 2024-10-14 at 21 31 21@2x](https://github.com/user-attachments/assets/4afea8b2-5aee-4fb7-a2c1-a03d4634ed85)

## Prerequisites
This works on Visual Studio Code version `1.93.1`; everything bar sidebar transparency should work on the latest version but transparency may not.

## Setup
### 1. Install the [APC Customize UI++](https://marketplace.visualstudio.com/items?itemName=drcika.apc-extension) extension
This is used to enable custom CSS styling and the material on the sidebar.

### 2. Copy over `settings.json`
This file contains all the customisations, including custom CSS styling and other editor properties.

### 3. Install [Actual Xcode Theme](https://marketplace.visualstudio.com/items?itemName=telmen.actual-xcode-theme) (Dark) and [Xcode Default Theme](https://marketplace.visualstudio.com/items?itemName=smockle.xcode-default-theme) (Light) and set themes
There are some slightly modified versions of these themes in this repo, feel free to drag these into `~/.vscode/extensions` to update the existing folders.
Also be sure to set your VSCode theme mode to `Auto` in Settings if you want your VSCode theme to match the device appearance.

### 4. (Optional) Add fonts
You may wish to use SF Mono Medium and Xcode Digits (located in `/Applications/Xcode.app/Contents/SharedFrameworks/DVTUserInterfaceKit.framework/Versions/A/Resources/Fonts` on macOS). Set `SFMono-Medium` under `Editor: Font Family` in Settings, and simply dragging the Xcode Digits font into your device's fonts folder will have it show up in VSCode (the CSS is there for it already).
