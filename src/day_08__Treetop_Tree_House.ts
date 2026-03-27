import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2022/day/8
 * 
 * https://www.reddit.com/r/adventofcode/comments/zfpnka/2022_day_8_solutions/
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day08/day_08__Treetop_Tree_House.js
 * 
 * Day 08 - Treetop Tree House
 * 
 *    R1C1 5 is_visible 2 -> Right 1  Left 1  Above 1  Below 1 = Score 1
 *    R1C2 5 is_visible 2 -> Right 2  Left 1  Above 1  Below 2 = Score 4
 *    R1C3 1 is_visible 0 -> Right 1  Left 1  Above 1  Below 1 = Score 1
 *    R2C1 5 is_visible 1 -> Right 3  Left 1  Above 1  Below 2 = Score 6
 *    R2C2 3 is_visible 0 -> Right 1  Left 1  Above 1  Below 1 = Score 1
 *    R2C3 3 is_visible 1 -> Right 1  Left 1  Above 2  Below 1 = Score 2
 *    R3C1 3 is_visible 0 -> Right 1  Left 1  Above 1  Below 1 = Score 1
 *    R3C2 5 is_visible 2 -> Right 2  Left 2  Above 2  Below 1 = Score 8
 *    R3C3 4 is_visible 0 -> Right 1  Left 1  Above 3  Below 1 = Score 3
 * 
 *      01234        01234
 * 
 *   0  30373     0  .....
 *   1  25512     1  .11..
 *   2  65332     2  .1.1.
 *   3  33549     3  ..1..
 *   4  35390     4  .....
 * 
 * 
 * Infield Visibility  5
 * Outfield Visibility 16
 * 
 * Result Part 1 = 21
 * Result Part 2 = 8
 * 
 * Day 08 - Ende
 */

type TreeMap = Record< string, number >; 

const STR_COMBINE_SPACER                 : string = "   "; 


function wl( pString : string ) // wl = short for "writeLog"
{
    console.log( pString );
}


function pad( pInput : string | number, pPadLeft : number ) : string 
{
    let str_result : string = pInput.toString();

    while (str_result.length < pPadLeft)
    { 
        str_result = " " + str_result;
    }

    return str_result;
}


function combineStrings( pString1: string | undefined | null, pString2: string | undefined | null ) : string 
{
    const lines1 = ( pString1 != null ? pString1.split(/\r?\n/) : [] );
    const lines2 = ( pString2 != null ? pString2.split(/\r?\n/) : [] );

    const max_lines = Math.max( lines1.length, lines2.length );

    let result : string[] = [];

    for ( let line_index = 0; line_index < max_lines; line_index++ ) 
    {
        const str_a = line_index < lines1.length ? lines1[ line_index ] : "";
        const str_b = line_index < lines2.length ? lines2[ line_index ] : "";

        result.push( str_a + STR_COMBINE_SPACER + str_b );
    }

    return result.join("\n");
}


function getDebugMap( pHashMap : TreeMap, pMaxRows : number, pMaxCols : number ): string 
{
    let str_result : string = "";

    str_result += pad( " ", 3 ) + "  ";

    for ( let cur_col = 0; cur_col < pMaxCols; cur_col++ )
    {
        str_result += cur_col % 10;
    }

    str_result += "\n";

    for ( let cur_row = 0; cur_row < pMaxRows; cur_row++ )
    {
        str_result += pad( cur_row, 3 ) + "  ";

        for ( let cur_col = 0; cur_col < pMaxCols; cur_col++ )
        {
            str_result += pHashMap[ "R" + cur_row  + "C" + cur_col ] ?? ".";
        }

        str_result += "\n";
    }

    return str_result;
}


function getVisibilityNumbers( pHashMap : TreeMap, pMaxRows : number, pMaxCols : number, pRow : number, pCol : number, pKnzDebug : boolean ) : { is_visible : number, visibility_value : number }
{
    let number_check         : number = pHashMap[ "R" + pRow + "C" + pCol ]!;

    let knz_is_visible_right : number = 1;
    let knz_is_visible_left  : number = 1;
    let knz_is_visible_above : number = 1;
    let knz_is_visible_below : number = 1;

    let value_visible_right  : number = 0;
    let value_visible_left   : number = 0;
    let value_visible_above  : number = 0;
    let value_visible_below  : number = 0;

    for ( let cur_col = pCol + 1; ( cur_col < pMaxCols ) && ( knz_is_visible_right === 1 ); cur_col++ )
    {
        let number_cur : number = pHashMap[ "R" + pRow + "C" + cur_col ]!;

        value_visible_right++;

        if ( number_cur >= number_check )
        {
            knz_is_visible_right = 0;
        }
    }

    for ( let cur_col = pCol - 1; ( cur_col >= 0 ) && ( knz_is_visible_left === 1 ); cur_col-- )
    {
        let number_cur : number = pHashMap[ "R" + pRow + "C" + cur_col ]!;

        value_visible_left++;

        if ( number_cur >= number_check )
        {
            knz_is_visible_left = 0;
        }
    }

    for ( let cur_row = pRow - 1; ( cur_row >= 0 ) && ( knz_is_visible_above === 1 ); cur_row-- )
    {
        let number_cur : number = pHashMap[ "R" + cur_row + "C" + pCol ]!;

        value_visible_above++;

        if ( number_cur >= number_check )
        {
            knz_is_visible_above = 0;
        }
    }

    for ( let cur_row = pRow + 1; ( cur_row < pMaxRows ) && ( knz_is_visible_below === 1 ); cur_row++ )
    {
        let number_cur : number = pHashMap[ "R" + cur_row + "C" + pCol ]!;

        value_visible_below++;

        if ( number_cur >= number_check )
        {
            knz_is_visible_below = 0;
        }
    }

    let visibility_value : number = value_visible_right * value_visible_left * value_visible_above * value_visible_below;

    let is_visible       : number = knz_is_visible_above + knz_is_visible_below + knz_is_visible_left + knz_is_visible_right

    if ( pKnzDebug )
    {
        wl( pad( "R" + pRow + "C" + pCol, 7 ) + " " + number_check + " is_visible " + is_visible + " -> Right " + value_visible_right  + "  Left " + value_visible_left   + "  Above " + value_visible_above  + "  Below " + value_visible_below + " = Score " + visibility_value);
    }

    return { is_visible : is_visible, visibility_value : visibility_value }
}


function calcArray( pArray: string[], pKnzDebug : boolean = true ) : void 
{
    /*
     * *******************************************************************************************************
     * Initializing the tree map
     * *******************************************************************************************************
     */

    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let grid_rows      : number = 0; 
    let grid_cols      : number = 0;

    let map_input      : TreeMap = {};
    
    for ( const cur_input_str of pArray ) 
    {
        for ( let cur_col1 = 0; cur_col1 < cur_input_str.length; cur_col1++ ) 
        {
            grid_cols = cur_col1;

            let cur_char_input : string = cur_input_str[ grid_cols ] ?? ".";

            map_input[ "R" + grid_rows + "C" + grid_cols ] = parseInt( cur_char_input );
        }

        grid_rows++;
    }

    grid_cols++;

    /*
     * *******************************************************************************************************
     * Calculating Part 1 and 2
     * *******************************************************************************************************
     */

    let outfield_number : number  = ( grid_rows * 2 ) + ( ( grid_cols - 2 ) * 2 );

    let infield_number  : number  = 0;

    let map_visibility  : TreeMap = {};

    for ( let cur_row = 1; cur_row < ( grid_rows - 1 ); cur_row++ )
    {
        for ( let cur_col = 1; cur_col < ( grid_cols - 1 ); cur_col++ )
        {
            let res_vis : { is_visible : number, visibility_value : number } = getVisibilityNumbers( map_input, grid_rows, grid_cols, cur_row, cur_col, pKnzDebug );

            if ( res_vis.visibility_value > result_part_02 )
            {
                result_part_02 = res_vis.visibility_value;
            }

            if ( res_vis.is_visible > 0 )
            {
                infield_number += 1;

                map_visibility[ "R" + cur_row + "C" + cur_col ] = 1;
            }
        }
    }

    result_part_01 = outfield_number + infield_number;

    /*
     * *******************************************************************************************************
     * Displaying results
     * *******************************************************************************************************
     */

    if ( pKnzDebug )
    {
        wl( "" );
        wl( combineStrings( getDebugMap( map_input, grid_rows, grid_cols ), getDebugMap( map_visibility, grid_rows, grid_cols ) ) );
        wl( "" );
        wl( "Infield Visibility  " + infield_number  );
        wl( "Outfield Visibility " + outfield_number );
    }

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2022__day08_input.txt";

    const lines: string[] = [];

    const fileStream = await fs.open( filePath, 'r' ).then( handle => handle.createReadStream() );

    const rl = readline.createInterface( { input: fileStream, crlfDelay: Infinity } );

    for await ( const line of rl ) 
    {
        lines.push( line );
    }

    rl.close();

    fileStream.destroy();

    return lines;
}


function checkReaddatei() : void 
{
    ( async () => {

        const arrFromFile = await readFileLines();

        calcArray( arrFromFile, false );
    } )();
}


function getTestArray1() : string[] 
{
    const array_test: string[] = [];
    
    array_test.push( "30373" );
    array_test.push( "25512" );
    array_test.push( "65332" );
    array_test.push( "33549" );
    array_test.push( "35390" );

    return array_test;
}


wl( "Day 08 - Treetop Tree House" );
wl( "" );

calcArray( getTestArray1(), true );

//checkReaddatei();

wl( "" )
wl( "Day 08 - Ende" );
