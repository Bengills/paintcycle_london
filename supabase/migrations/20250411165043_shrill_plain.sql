/*
  # Update color columns to British English spelling

  1. Changes
    - Rename 'color' to 'colour' in paint_listings table
    - Rename 'color_hex' to 'colour_hex' in paint_listings table
    - Preserve existing data during column rename
*/

ALTER TABLE paint_listings 
  RENAME COLUMN color TO colour;

ALTER TABLE paint_listings 
  RENAME COLUMN color_hex TO colour_hex;