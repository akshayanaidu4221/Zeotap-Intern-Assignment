# Google Sheets Clone

A web application that mimics the user interface and core functionalities of Google Sheets, with a focus on mathematical and data quality functions, data entry, and key UI interactions.

## Data Structures and Tech Stack

### Tech Stack

- **React**: Used for building the user interface components
- **TypeScript**: Provides type safety and better developer experience
- **Zustand**: Lightweight state management library for managing the spreadsheet data
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Vite**: Fast build tool and development server

### Data Structures

The application uses the following key data structures:

1. **SpreadsheetData**: A key-value object where:
   - Keys are cell IDs in the format "row:col" (e.g., "0:0" for cell A1)
   - Values are Cell objects containing the cell's value, formula, and styling information

2. **Cell**: An object representing a single cell with:
   - `id`: Unique identifier for the cell
   - `value`: The actual value stored in the cell (string, number, or null)
   - `displayValue`: The formatted value shown to the user
   - `formula`: The formula string if the cell contains a formula
   - `style`: An object containing styling information

3. **Selection**: Represents the currently selected range of cells:
   - `start`: The row and column indices of the starting cell
   - `end`: The row and column indices of the ending cell

4. **CellStyle**: Contains styling information for a cell:
   - `bold`: Whether the text is bold
   - `italic`: Whether the text is italic
   - `fontSize`: The font size in pixels
   - `color`: The text color
   - `backgroundColor`: The background color
   - `textAlign`: The text alignment (left, center, or right)

### Formula Evaluation

The formula evaluation system uses a recursive approach:

1. Formulas are identified by a leading equals sign (=)
2. The formula parser extracts function names and arguments
3. Cell references are resolved to their actual values
4. Functions are evaluated with their resolved arguments
5. Results are displayed in the cell

This approach allows for nested functions and complex formulas while maintaining a clean separation between the UI and the calculation logic.

## Features

### Spreadsheet Interface
- Google Sheets-like UI with toolbar, formula bar, and cell structure
- Drag functionality for cell content and selections
- Cell dependencies with formula evaluation
- Cell formatting (bold, italics, alignment)
- Add, delete, and resize rows and columns

### Mathematical Functions
- SUM: Calculates the sum of a range of cells
- AVERAGE: Calculates the average of a range of cells
- MAX: Returns the maximum value from a range of cells
- MIN: Returns the minimum value from a range of cells
- COUNT: Counts the number of cells containing numerical values in a range

### Data Quality Functions
- TRIM: Removes leading and trailing whitespace from a cell
- UPPER: Converts the text in a cell to uppercase
- LOWER: Converts the text in a cell to lowercase
- REMOVE_DUPLICATES: Removes duplicate rows from a selected range
- FIND_AND_REPLACE: Allows users to find and replace specific text within a range of cells

### Data Entry and Validation
- Support for various data types (numbers, text)
- Formula evaluation with error handling

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`
4. Open your browser to the URL shown in the terminal

## Usage

- Click on a cell to select it
- Double-click to edit a cell
- Enter values or formulas (starting with =)
- Use the toolbar to format cells
- Drag the fill handle (blue square in the bottom-right corner of a selected cell) to copy values or formulas
- Use the Find and Replace feature from the toolbar
- Access Data Operations from the top menu
