import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2022/day/14
 * 
 * https://www.reddit.com/r/adventofcode/comments/zli1rd/2022_day_14_solutions/
 * 
 * 
 * 
 */

const CHAR_SAND          : string = "O";
const CHAR_NO_MAP        : string = " ";
const CHAR_MAP_AIR       : string = ".";
const CHAR_MAP_ROCK      : string = "#"; 
const CHAR_MAP_SAND_INPUT : string = "+";

const STR_COMBINE_SPACER : string = "     "; 

const COL_ADJUSTMENT : number = 490;

const SAND_INPUT_ROW : number = 0;
const SAND_INPUT_COL : number = 500 - COL_ADJUSTMENT;

type PropertieMap = Record< string, string >;

function wl( pString : string ) // wl = short for "writeLog"
{
    console.log( pString );
}


function padL( pInput : string | number, pPadLeft : number ) : string 
{
    let str_result : string = pInput.toString();

    while ( str_result.length < pPadLeft )
    { 
        str_result = " " + str_result;
    }

    return str_result;
}


function padR( pInput : string | number, pPadRight : number ) : string 
{
    let str_result : string = pInput.toString();

    while ( str_result.length < pPadRight )
    { 
        str_result = str_result + " ";
    }

    return str_result;
}


function combineStrings( pString1 : string | undefined | null, pString2 : string | undefined | null ) : string 
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


function getDebugMap( pHashMap : PropertieMap, pMinRows : number, pMinCols : number, pMaxRows : number, pMaxCols : number ) : string 
{
    let str_result : string = "";

    str_result += padL( " ", 3 ) + "  ";

    for ( let cur_col = pMinCols; cur_col < pMaxCols; cur_col++ )
    {
        str_result += Math.abs( cur_col ) % 10;
    }

    for ( let cur_row = pMinRows; cur_row < pMaxRows; cur_row++ )
    {
        str_result += "\n";
        str_result += padL( cur_row, 3 ) + "  ";

        for ( let cur_col = pMinCols; cur_col < pMaxCols; cur_col++ )
        {
            str_result += pHashMap[ "R" + cur_row  + "C" + cur_col ] ?? " ";
        }
    }

    return str_result;
}


type Coords = { row : number; col : number };

class Line 
{
    vektor_coords : Coords[]  = [];

    constructor( pInput : string ) 
    {
        let input_coords_str_v : string[]  = pInput.split( " -> " );

        for ( let cors of input_coords_str_v )
        {
            let [ s_col, s_row ] = cors.split( "," );

            this.vektor_coords.push( { row : parseInt( s_row! ), col : ( parseInt( s_col! ) - COL_ADJUSTMENT ) } );
        }
    }

    private getKey( pIndex : number ) : string 
    {
        return "R" + this.vektor_coords[ pIndex ]!.row + "C" + this.vektor_coords[ pIndex ]!.col; 
    }

    private drawLine( pMapInput : PropertieMap, pCoordsStart : Coords, pCoordsEnd : Coords ) : void 
    {
        let row_from : number = pCoordsStart.row;
        let row_to   : number = pCoordsEnd.row;

        let col_from : number = pCoordsStart.col;
        let col_to   : number = pCoordsEnd.col;

        let delta_row : number = Math.sign( row_to - row_from );
        let delta_col : number = Math.sign( col_to - col_from );

        if ( delta_row !== 0 )
        {
            for ( let cur_row : number = row_from; cur_row != row_to; cur_row += delta_row )
            {
                pMapInput[ "R" + cur_row + "C" + col_from ] = CHAR_MAP_ROCK;
            }
        }

        if ( delta_col !== 0 )
        {
            for ( let cur_col : number = col_from; cur_col != col_to; cur_col += delta_col )
            {
                pMapInput[ "R" + row_from + "C" + cur_col ] = CHAR_MAP_ROCK;
            }
        }
    }

    public draw( pMapInput : PropertieMap )
    {
        if ( this.vektor_coords.length === 1 )
        {
            pMapInput[ this.getKey( 0 ) ] = CHAR_MAP_ROCK;
        }
        else
        {
            for ( let index_l : number = 1; index_l < this.vektor_coords.length; index_l++ )
            {
                this.drawLine( pMapInput, this.vektor_coords[ index_l - 1]!, this.vektor_coords[ index_l ]! );
            }
        }
    }

    public toString() 
    {
        let str_result : string = "";

        for ( let co_cur of this.vektor_coords )
        {
            str_result +=  ", R " + co_cur.row  + " C " + co_cur.col;
        }

        return str_result;
    }
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    /*
     * *******************************************************************************************************
     * Creating the vektor of lines
     * *******************************************************************************************************
     */
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let vektor_line : Line[] = [];

    for ( const cur_input_str of pArray ) 
    {
        wl( cur_input_str );

        vektor_line.push( new Line( cur_input_str ) );
    }

    if ( pKnzDebug )
    {
        for ( let line_inst of vektor_line )
        {
            wl( line_inst.toString() );
        }
    }

    /*
     * *******************************************************************************************************
     * Setting up the virtual grid (Drawing the lines)
     * *******************************************************************************************************
     */

    let map_input : PropertieMap = {};

    for ( let line_inst of vektor_line )
    {
        line_inst.draw( map_input );
    }

    map_input[ "R" + SAND_INPUT_ROW + "C" + SAND_INPUT_COL ] = CHAR_MAP_SAND_INPUT;

    if ( pKnzDebug )
    {
        let dbg_map_comb = getDebugMap( map_input,  0, 0, 20, 40 );

        wl( "" );
        wl( dbg_map_comb  );
    }

    /*
     * *******************************************************************************************************
     * Calculating the result value for part 1
     * *******************************************************************************************************
     */

    result_part_01 = 0;


    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2022__day14_input.txt";

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

    array_test.push( "490,1" );

    array_test.push( "498,4 -> 498,6 -> 496,6" );
    array_test.push( "503,4 -> 502,4 -> 502,9 -> 494,9" );

    return array_test;
}

wl( "" );
wl( "Day14 - Regolith Reservoir" );
wl( "" );

calcArray( getTestArray1(), true );

//checkReaddatei();

wl( "" )
wl( "Day 14 - Ende" );
