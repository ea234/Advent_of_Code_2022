import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2022/day/9
 * 
 * https://www.reddit.com/r/adventofcode/comments/zgnice/2022_day_9_solutions/
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day09/day_09__Rope_Bridge.js
 * 
 * Day 09 - Rope Bridge
 * 
 * Step   1 Direction R   4 - Head R5C9 Tail R5C8
 * Step   2 Direction U   4 - Head R1C9 Tail R2C9
 * Step   3 Direction L   3 - Head R1C6 Tail R1C7
 * Step   4 Direction D   1 - Head R2C6 Tail R2C6
 * Step   5 Direction R   4 - Head R2C10 Tail R2C9
 * Step   6 Direction D   1 - Head R3C10 Tail R3C10
 * Step   7 Direction L   5 - Head R3C5 Tail R3C6
 * Step   8 Direction R   2 - Head R3C7 Tail R3C6
 * 
 *      012345678901234        012345678901234
 *   0                      0
 *   1        HHHH          1         TT
 *   2        HHHHH         2        TTTT
 *   3       HHHHHH         3        TTTTT
 *   4           H          4           T
 *   5        HHHH          5       TTTT
 *   6                      6
 *   7                      7
 *   8                      8
 *   9                      9
 * 
 * 
 * Result Part 1 = 20
 * Result Part 2 = 16
 * 
 * Day 09 - Ende
 * 
 */

const CHAR_MAP_HEAD : string = "H";
const CHAR_MAP_TAIL : string = "T";
const CHAR_MAP_FREE : string = " ";

const STR_COMBINE_SPACER : string = "   "; 

type PropertieMap = Record< string, string >;

class RopeBridge
{
    map_head_row : number = 0;
    map_head_col : number = 0;

    map_tail_row : number = 0;
    map_tail_col : number = 0;

    map_tail     : PropertieMap = {};
    map_head     : PropertieMap = {};

    constructor( pMapRow : number, pMapCol : number )
    {
        this.map_head_row = pMapRow;
        this.map_head_col = pMapCol;

        this.map_tail_row = pMapRow;
        this.map_tail_col = pMapCol;
    }

    public getHeadMap() : PropertieMap 
    {
        return this.map_head;
    }

    public getTailMap() : PropertieMap 
    {
        return this.map_tail;
    }

    public getMapHeadRow() : number 
    {
        return this.map_head_row;
    }

    public getMapHeadCol() : number 
    {
        return this.map_head_col;
    }

    public getMapTailRow() : number 
    {
        return this.map_tail_row;
    }

    public getMapTailCol() : number 
    {
        return this.map_tail_col;
    }

    public getMapHeadKey() : string 
    {
        return "R" + this.map_head_row + "C" + this.map_head_col;
    }

    public getMapTailKey() : string 
    {
        return "R" + this.map_tail_row + "C" + this.map_tail_col;
    }

    public getMinRow()
    {
        return this.map_tail_row < this.map_head_row ? this.map_tail_row : this.map_head_row;
    }

    public getMaxRow()
    {
        return this.map_tail_row > this.map_head_row ? this.map_tail_row : this.map_head_row;
    }

    public getMinCol()
    {
        return this.map_tail_col < this.map_head_col ? this.map_tail_col : this.map_head_col;
    }

    public getMaxCol()
    {
        return this.map_tail_col > this.map_head_col ? this.map_tail_col : this.map_head_col;
    }

    public moveHead( pDirection : string, pAmount : string )
    {
        let move_value     : number = parseInt( pAmount );

        let delta_move_row : number = 0;
        let delta_move_col : number = 0;

        let step_direction : number = 0;

             if ( pDirection === "D" ) { delta_move_row = move_value; step_direction =  1; }
        else if ( pDirection === "U" ) { delta_move_row = move_value; step_direction = -1; }
        else if ( pDirection === "R" ) { delta_move_col = move_value; step_direction =  1; }
        else if ( pDirection === "L" ) { delta_move_col = move_value; step_direction = -1; }

        if ( delta_move_row > 0 )
        {
            for( let step_count = 0; step_count < delta_move_row; step_count++ )
            {
               this.map_head_row += step_direction;

               this.map_head[ this.getMapHeadKey() ] = CHAR_MAP_HEAD;

               this.moveTail();
            }
        }

        if ( delta_move_col > 0 )
        {
            for( let step_count = 0; step_count < delta_move_col; step_count++ )
            {
               this.map_head_col += step_direction;

               this.map_head[ this.getMapHeadKey() ] = CHAR_MAP_HEAD;

               this.moveTail();
            }
        }
    }

    public moveTail() 
    {
        /*
         * Head-Position is leading
         * 
         * head-position < tail = difference negative = tail row up   (row minus)
         * head-position > tail = difference positive = tail row down (row plus)
         * 
         * Head Row    4  4  4
         * Tail Row -  7  1  4
         * Delta      -3  3  0
         * Direction  -1  1  0
         */
        let delta_row_diff : number = this.map_head_row - this.map_tail_row;

        let direction_row  : number = Math.sign( delta_row_diff );

        let delta_row_step : number = ( delta_row_diff === 0 ? 0 : direction_row );


        let delta_col_diff : number = this.map_head_col - this.map_tail_col;

        let direction_col  : number = Math.sign( delta_col_diff );

        let delta_col_step : number = ( delta_col_diff === 0 ? 0 : direction_col );

        delta_row_step = 0;
        delta_col_step = 0;

        if ( ( Math.abs( delta_col_diff ) > 0 ) && ( Math.abs( delta_row_diff ) > 0 ) )
        {
            /* 
             * If the head and tail aren't touching 
             * and aren't in the same row or column, 
             * the tail always moves one step diagonally to keep up:
             */
            delta_col_step = direction_col;
            delta_row_step = direction_row;
        }
        else
        {
            /*
             * If the head is ever two steps directly up, down, left, or right from the tail, 
             * the tail must also move one step in that direction so it remains close enough.
             */

            if ( ( delta_col_diff === 0 ) && ( Math.abs( delta_row_diff ) === 2) ) 
            {
                delta_row_step = direction_row;
            }
            else if ( ( delta_row_diff === 0 ) && ( Math.abs( delta_col_diff ) === 2) ) 
            {
                delta_col_step = direction_col;
            }
            else
            {
                delta_row_step = 0;
                delta_col_step = 0;
            }

        }

        this.map_tail_row += delta_row_step;
        this.map_tail_col += delta_col_step;

        this.map_tail[ this.getMapTailKey() ] = CHAR_MAP_TAIL;
    }

    public toString() : string 
    {
        return "Head " + this.getMapHeadKey() + " Tail " + this.getMapTailKey();
    }
}


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

    str_result += pad( " ", 3 ) + "  ";

    for ( let cur_col = 0; cur_col < pMaxCols; cur_col++ )
    {
        str_result += cur_col % 10;
    }

    str_result += "\n";

    for ( let cur_row = pMinRows; cur_row < pMaxRows; cur_row++ )
    {
        str_result += pad( cur_row, 3 ) + "  ";

        for ( let cur_col = pMinCols; cur_col < pMaxCols; cur_col++ )
        {
            str_result += pHashMap[ "R" + cur_row  + "C" + cur_col ] ?? " ";
        }

        str_result += "\n";
    }

    return str_result;
}


function countTiles( pHashMap : PropertieMap, pMinRows : number, pMinCols : number, pMaxRows : number, pMaxCols : number, pTile : string ) : number
{
    let count_tile : number = 0;

    for ( let cur_row = pMinRows; cur_row < pMaxRows; cur_row++ )
    {
        for ( let cur_col = pMinCols; cur_col < pMaxCols; cur_col++ )
        {
            if ( ( pHashMap[ "R" + cur_row  + "C" + cur_col  ] ?? CHAR_MAP_FREE ) == pTile )
            {
                  count_tile++;
            }
        }
    }

    return count_tile;
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    /*
     * *******************************************************************************************************
     * Parsing the input Array. Doing the Movings
     * *******************************************************************************************************
     */
    let start_row        : number = 5;
    let start_col        : number = 5;

    let result_part_01   : number = 0;
    let result_part_02   : number = 0;

    let grid_min_row     : number = 0;
    let grid_min_col     : number = 0;

    let grid_max_rows    : number = 10;
    let grid_max_cols    : number = 10;
    
    let rope_bridge      : RopeBridge = new RopeBridge( start_row, start_col );

    let step_count       : number = 0;

    for ( const cur_input_str of pArray ) 
    {
        let [ s_direction, s_value ] = cur_input_str.trim().split( " " );

        step_count++;

        rope_bridge.moveHead( s_direction!, s_value! );

        wl( "Step " + pad( step_count, 3 ) + " Direction " + s_direction + " " + pad( s_value!, 3 ) + " - " + rope_bridge.toString() );

        if ( rope_bridge.getMinRow() < grid_min_row )
        {
            grid_min_row = rope_bridge.getMinRow();
        }

        if ( rope_bridge.getMinCol() < grid_min_col )
        {
            grid_min_col = rope_bridge.getMinCol() ;
        }

        if ( rope_bridge.getMaxRow() > grid_max_rows )
        {
            grid_max_rows = rope_bridge.getMaxRow();
        }

        if ( rope_bridge.getMaxCol() > grid_max_cols )
        {
            grid_max_cols = rope_bridge.getMaxCol() ;
        }
    }

    grid_max_cols += 5;

    /*
     * *******************************************************************************************************
     * Creating debug-maps for character counting
     * *******************************************************************************************************
     */

    let dbg_head_map : string = getDebugMap( rope_bridge.getHeadMap(), grid_min_row, grid_min_col, grid_max_rows, grid_max_cols ) 
    let dbg_tail_map : string = getDebugMap( rope_bridge.getTailMap(), grid_min_row, grid_min_col, grid_max_rows, grid_max_cols ) 

    result_part_01 = countTiles( rope_bridge.getHeadMap(), grid_min_row, grid_min_col, grid_max_rows, grid_max_cols, "H" );
    result_part_02 = countTiles( rope_bridge.getTailMap(), grid_min_row, grid_min_col, grid_max_rows, grid_max_cols, "T" );

    wl( "" );
    wl( "" );
    wl( combineStrings( dbg_head_map, dbg_tail_map ) );
    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2022__day07_input.txt";

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

    array_test.push( "R 4" );
    array_test.push( "U 4" );
    array_test.push( "L 3" );
    array_test.push( "D 1" );
    array_test.push( "R 4" );
    array_test.push( "D 1" );
    array_test.push( "L 5" );
    array_test.push( "R 2" );

    return array_test;
}

wl( "" );
wl( "Day 09 - Rope Bridge" );
wl( "" );

calcArray( getTestArray1(), true );

//checkReaddatei();

wl( "" )
wl( "Day 09 - Ende" );
