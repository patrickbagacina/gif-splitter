# GIF Split

This project is a simple web application that allows users to split a GIF into multiple parts.

## Setup and Running Instructions

1. Clone the repository to your local machine.
2. Open the `index.html` file in your web browser.

## Dependencies and Libraries

This project does not use any external libraries or dependencies. All functionality is implemented using vanilla JavaScript, HTML, and CSS.

## Approach

The approach I used for splitting the GIF involves the following steps:

1. The `img` elements are appended to a `div`, creating the illusion of splitting the GIF into frames.
2. For each part of the GIF, I create a new `div` and `img` element. The `div` acts as a window, displaying only a part of the `img`.
3. The `img` is positioned absolutely within the `div`, and its `top` and `left` properties are set so that the correct part of the image is displayed.
4. The `div` is then appended to the `split` div, which is displayed as a grid with the specified number of rows and columns.

## Challenges Faced

One of the main challenges I faced was splitting the GIF into equal parts. This required calculating the size of each part and the position of each part on the original image. I also had to ensure that the parts were appended to the `div` in the correct order to maintain the original layout of the image.

## Demo

![Demo Video](demo.webm)