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
 * 
 * Direction R Amount 4  R5C1 R5C0 diff R  0   0  C  1   1  Move  R  0 C  0 To R5C0
 * Direction R Amount 4  R5C2 R5C0 diff R  0   0  C  2   1  Move  R  0 C  1 To R5C1
 * Direction R Amount 4  R5C3 R5C1 diff R  0   0  C  2   1  Move  R  0 C  1 To R5C2
 * Direction R Amount 4  R5C4 R5C2 diff R  0   0  C  2   1  Move  R  0 C  1 To R5C3
 * Direction U Amount 4  R4C4 R5C3 diff R -1  -1  C  1   1  Move  R  0 C  0 To R5C3
 * Direction U Amount 4  R3C4 R5C3 diff R -2  -1  C  1   1  Move  R -1 C  1 To R4C4
 * Direction U Amount 4  R2C4 R4C4 diff R -2  -1  C  0   0  Move  R -1 C  0 To R3C4
 * Direction U Amount 4  R1C4 R3C4 diff R -2  -1  C  0   0  Move  R -1 C  0 To R2C4
 * Direction L Amount 3  R1C3 R2C4 diff R -1  -1  C -1  -1  Move  R  0 C  0 To R2C4
 * Direction L Amount 3  R1C2 R2C4 diff R -1  -1  C -2  -1  Move  R -1 C -1 To R1C3
 * Direction L Amount 3  R1C1 R1C3 diff R  0   0  C -2  -1  Move  R  0 C -1 To R1C2
 * Direction D Amount 1  R2C1 R1C2 diff R  1   1  C -1  -1  Move  R  0 C  0 To R1C2
 * Direction R Amount 4  R2C2 R1C2 diff R  1   1  C  0   0  Move  R  0 C  0 To R1C2
 * Direction R Amount 4  R2C3 R1C2 diff R  1   1  C  1   1  Move  R  0 C  0 To R1C2
 * Direction R Amount 4  R2C4 R1C2 diff R  1   1  C  2   1  Move  R  1 C  1 To R2C3
 * Direction R Amount 4  R2C5 R2C3 diff R  0   0  C  2   1  Move  R  0 C  1 To R2C4
 * Direction D Amount 1  R3C5 R2C4 diff R  1   1  C  1   1  Move  R  0 C  0 To R2C4
 * Direction L Amount 5  R3C4 R2C4 diff R  1   1  C  0   0  Move  R  0 C  0 To R2C4
 * Direction L Amount 5  R3C3 R2C4 diff R  1   1  C -1  -1  Move  R  0 C  0 To R2C4
 * Direction L Amount 5  R3C2 R2C4 diff R  1   1  C -2  -1  Move  R  1 C -1 To R3C3
 * Direction L Amount 5  R3C1 R3C3 diff R  0   0  C -2  -1  Move  R  0 C -1 To R3C2
 * Direction L Amount 5  R3C0 R3C2 diff R  0   0  C -2  -1  Move  R  0 C -1 To R3C1
 * Direction R Amount 2  R3C1 R3C1 diff R  0   0  C  0   0  Move  R  0 C  0 To R3C1
 * Direction R Amount 2  R3C2 R3C1 diff R  0   0  C  1   1  Move  R  0 C  0 To R3C1
 * 
 *      012345        012345        012345
 *   0             0             0
 *   1   HHHH      1    TT       1
 *   2   HHHHH     2     TT      2
 *   3  HHHHHH     3   TTTT      3   TH
 *   4      H      4      T      4
 *   5   HHHH      5  TTTT       5
 * 
 * Result Part 1 = 13
 * Result Part 2 = 0
 * 
 * Day 09 - Ende
 * 
 * ----------------------------------------------------------------------------
 * Test with negative grid numbers
 * 
 * Direction L Amount 5  R0C1 R0C3 diff R  0   0  C -2  -1  Move  R  0 C -1 To R0C2
 * 
 *      012345        012345        012345
 *  -2   HHHH     -2    TT      -2
 *  -1   HHHHH    -1     TT     -1
 *   0  HHHHHH     0   TTTT      0  HT
 *   1      H      1      T      1
 *   2   HHHH      2  TTTT       2
 * 
 * Direction L Amount 5  R0C0 R0C2 diff R  0   0  C -2  -1  Move  R  0 C -1 To R0C1
 * 
 *      012345        012345        012345
 *  -2   HHHH     -2    TT      -2
 *  -1   HHHHH    -1     TT     -1
 *   0  HHHHHH     0   TTTT      0   T
 *   1      H      1      T      1
 *   2   HHHH      2  TTTT       2
 * 
 * Direction R Amount 2  R0C1 R0C1 diff R  0   0  C  0   0  Move  R  0 C  0 To R0C1
 * 
 *      012345        012345        012345
 *  -2   HHHH     -2    TT      -2
 *  -1   HHHHH    -1     TT     -1
 *   0  HHHHHH     0   TTTT      0   TH
 *   1      H      1      T      1
 *   2   HHHH      2  TTTT       2
 * 
 * Direction R Amount 2  R0C2 R0C1 diff R  0   0  C  1   1  Move  R  0 C  0 To R0C1
 * 
 *      012345        012345        012345
 *  -2   HHHH     -2    TT      -2
 *  -1   HHHHH    -1     TT     -1
 *   0  HHHHHH     0   TTTT      0   TH
 *   1      H      1      T      1
 *   2   HHHH      2  TTTT       2
 * 
 * Result Part 1 = 13
 * Result Part 2 = 0
 * 
 * 
 */

const CHAR_MAP_HEAD : string = "H";
const CHAR_MAP_TAIL : string = "T";
const CHAR_MAP_FREE : string = " ";

const STR_COMBINE_SPACER : string = "   "; 

type PropertieMap = Record< string, string >;

class RopeBridge
{
    map_head_row  : number = 0;
    map_head_col  : number = 0;

    map_tail_row  : number = 0;
    map_tail_col  : number = 0;

    map_tail      : PropertieMap = {};
    map_head      : PropertieMap = {};

    grid_min_row  : number = 0;
    grid_min_col  : number = 0;

    grid_max_rows : number = 1;
    grid_max_cols : number = 1;

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
        return ( this.map_tail_row > this.map_head_row ? this.map_tail_row : this.map_head_row ) + 1;
    }

    public getMinCol()
    {
        return this.map_tail_col < this.map_head_col ? this.map_tail_col : this.map_head_col;
    }

    public getMaxCol()
    {
        return ( this.map_tail_col > this.map_head_col ? this.map_tail_col : this.map_head_col ) + 1;
    }

    private checkGridMinMax()
    {
        if ( this.getMinRow() < this.grid_min_row )
        {
            this.grid_min_row = this.getMinRow();
        }

        if ( this.getMinCol() < this.grid_min_col )
        {
            this.grid_min_col = this.getMinCol();
        }

        if ( this.getMaxRow() > this.grid_max_rows )
        {
            this.grid_max_rows = this.getMaxRow();
        }

        if ( this.getMaxCol() > this.grid_max_cols )
        {
            this.grid_max_cols = this.getMaxCol();
        }
    }
 
    public countTailPath() : number
    {
        return countTiles( this.getTailMap(), this.grid_min_row, this.grid_min_col, this.grid_max_rows, this.grid_max_cols, CHAR_MAP_TAIL );
    }

    public getDebugGridHead() : string 
    {
        return getDebugMap( this.getHeadMap(), this.grid_min_row, this.grid_min_col, this.grid_max_rows, this.grid_max_cols ); 
    }


    public getDebugGridTail() : string 
    {
        return getDebugMap( this.getTailMap(), this.grid_min_row, this.grid_min_col, this.grid_max_rows, this.grid_max_cols ); 
    }

    public getDebugMaps() : string 
    {
        let map_both      : PropertieMap = {};

        map_both[ this.getMapHeadKey() ] = CHAR_MAP_HEAD;
        map_both[ this.getMapTailKey() ] = CHAR_MAP_TAIL;

        let dbg_head_map : string = this.getDebugGridHead(); 

        let dbg_tail_map : string = this.getDebugGridTail(); 

        let dbg_map_both : string = getDebugMap( map_both,          this.grid_min_row, this.grid_min_col, this.grid_max_rows, this.grid_max_cols ); 

        return combineStrings( combineStrings( dbg_head_map, dbg_tail_map ), dbg_map_both ) + "\n";
    }
   
    public moveHead( pDirection : string, pAmount : string, pKnzDebug : boolean = false )
    {
        let dbg_string     : string = "Direction " + pDirection + " Amount " + pAmount + " ";

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

                let dbg_string1 = dbg_string + this.moveTail( pKnzDebug );

                if ( pKnzDebug )
                {
                    wl( this.getDebugMaps() + "\n" + dbg_string1 + "\n" );
                }
            }
        }

        if ( delta_move_col > 0 )
        {
            for( let step_count = 0; step_count < delta_move_col; step_count++ )
            {
                this.map_head_col += step_direction;

                this.map_head[ this.getMapHeadKey() ] = CHAR_MAP_HEAD;

                let dbg_string1 = dbg_string + this.moveTail( pKnzDebug );

                if ( pKnzDebug )
                {
                    wl( this.getDebugMaps() + "\n" + dbg_string1 + "\n" );
                }
            }
        }
    }

    private moveTail( pKnzDebug : boolean ) : string 
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

        let delta_row_step : number = 0;


        let delta_col_diff : number = this.map_head_col - this.map_tail_col;

        let direction_col  : number = Math.sign( delta_col_diff );

        let delta_col_step : number = 0;

        if ( Math.abs( delta_row_diff ) > 1 )
        {
            delta_row_step = direction_row;
        }

        if ( Math.abs( delta_col_diff ) > 1 )
        {
            delta_col_step = direction_col;
        }

        if ( Math.abs( delta_row_diff ) == 2 )
        {
            delta_col_step = direction_col;
        }
       
        if ( Math.abs( delta_col_diff ) == 2 )
        {
            delta_row_step = direction_row;
        }

        let dbg_string : string = pKnzDebug ? " " + this.getMapHeadKey() + " " + this.getMapTailKey() : "";
        
        this.map_tail_row += delta_row_step;
        this.map_tail_col += delta_col_step;

        if ( pKnzDebug )
        {
            dbg_string += " diff R "   + pad( delta_row_diff, 2 ) + "  "  + pad( direction_row,  2 );
            dbg_string += "  C "       + pad( delta_col_diff, 2 ) + "  "  + pad( direction_col,  2 );
            dbg_string += "  Move  R " + pad( delta_row_step, 2 ) + " C " + pad( delta_col_step, 2 );
            dbg_string += " To " + this.getMapTailKey();
        }

        this.map_tail[ this.getMapTailKey() ] = CHAR_MAP_TAIL;

        this.checkGridMinMax();

        return dbg_string
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

    for ( let cur_row = pMinRows; cur_row < pMaxRows; cur_row++ )
    {
        str_result += "\n";
        str_result += pad( cur_row, 3 ) + "  ";

        for ( let cur_col = pMinCols; cur_col < pMaxCols; cur_col++ )
        {
            str_result += pHashMap[ "R" + cur_row  + "C" + cur_col ] ?? " ";
        }
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
    let start_row        : number = 2;
    let start_col        : number = 0;

    let result_part_01   : number = 0;
    let result_part_02   : number = 0;
    
    let rope_bridge      : RopeBridge = new RopeBridge( start_row, start_col );

    for ( const cur_input_str of pArray ) 
    {
        let [ s_direction, s_value ] = cur_input_str.trim().split( " " );

        rope_bridge.moveHead( s_direction!, s_value!, pKnzDebug );
    }

    /*
     * *******************************************************************************************************
     * Creating debug-maps for character counting
     * *******************************************************************************************************
     */

    result_part_01 = rope_bridge.countTailPath();

    wl( "" );

    if ( pKnzDebug )
    {
        wl( "" );
        wl( rope_bridge.getDebugMaps() );
        wl( "" );
    }

    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2022__day09_input.txt";

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

/*
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day09/day_09__Rope_Bridge.js
 * 
 * Day 09 - Rope Bridge
 * 
 *      01        01        01
 *   0         0         0
 *   1         1         1
 *   2         2         2
 *   3         3         3
 *   4         4         4
 *   5   H     5  T      5  TH
 * 
 * Direction R Amount 4  R5C1 R5C0 diff R  0   0  C  1   1  Move  R  0 C  0 To R5C0
 * 
 *      012        012        012
 *   0          0          0
 *   1          1          1
 *   2          2          2
 *   3          3          3
 *   4          4          4
 *   5   HH     5  TT      5   TH
 * 
 * Direction R Amount 4  R5C2 R5C0 diff R  0   0  C  2   1  Move  R  0 C  1 To R5C1
 * 
 *      0123        0123        0123
 *   0           0           0
 *   1           1           1
 *   2           2           2
 *   3           3           3
 *   4           4           4
 *   5   HHH     5  TTT      5    TH
 * 
 * Direction R Amount 4  R5C3 R5C1 diff R  0   0  C  2   1  Move  R  0 C  1 To R5C2
 * 
 *      01234        01234        01234
 *   0            0            0
 *   1            1            1
 *   2            2            2
 *   3            3            3
 *   4            4            4
 *   5   HHHH     5  TTTT      5     TH
 * 
 * Direction R Amount 4  R5C4 R5C2 diff R  0   0  C  2   1  Move  R  0 C  1 To R5C3
 * 
 *      01234        01234        01234
 *   0            0            0
 *   1            1            1
 *   2            2            2
 *   3            3            3
 *   4      H     4            4      H
 *   5   HHHH     5  TTTT      5     T
 * 
 * Direction U Amount 4  R4C4 R5C3 diff R -1  -1  C  1   1  Move  R  0 C  0 To R5C3
 * 
 *      01234        01234        01234
 *   0            0            0
 *   1            1            1
 *   2            2            2
 *   3      H     3            3      H
 *   4      H     4      T     4      T
 *   5   HHHH     5  TTTT      5
 * 
 * Direction U Amount 4  R3C4 R5C3 diff R -2  -1  C  1   1  Move  R -1 C  1 To R4C4
 * 
 *      01234        01234        01234
 *   0            0            0
 *   1            1            1
 *   2      H     2            2      H
 *   3      H     3      T     3      T
 *   4      H     4      T     4
 *   5   HHHH     5  TTTT      5
 * 
 * Direction U Amount 4  R2C4 R4C4 diff R -2  -1  C  0   0  Move  R -1 C  0 To R3C4
 * 
 *      01234        01234        01234
 *   0            0            0
 *   1      H     1            1      H
 *   2      H     2      T     2      T
 *   3      H     3      T     3
 *   4      H     4      T     4
 *   5   HHHH     5  TTTT      5
 * 
 * Direction U Amount 4  R1C4 R3C4 diff R -2  -1  C  0   0  Move  R -1 C  0 To R2C4
 * 
 *      01234        01234        01234
 *   0            0            0
 *   1     HH     1            1     H
 *   2      H     2      T     2      T
 *   3      H     3      T     3
 *   4      H     4      T     4
 *   5   HHHH     5  TTTT      5
 * 
 * Direction L Amount 3  R1C3 R2C4 diff R -1  -1  C -1  -1  Move  R  0 C  0 To R2C4
 * 
 *      01234        01234        01234
 *   0            0            0
 *   1    HHH     1     T      1    HT
 *   2      H     2      T     2
 *   3      H     3      T     3
 *   4      H     4      T     4
 *   5   HHHH     5  TTTT      5
 * 
 * Direction L Amount 3  R1C2 R2C4 diff R -1  -1  C -2  -1  Move  R -1 C -1 To R1C3
 * 
 *      01234        01234        01234
 *   0            0            0
 *   1   HHHH     1    TT      1   HT
 *   2      H     2      T     2
 *   3      H     3      T     3
 *   4      H     4      T     4
 *   5   HHHH     5  TTTT      5
 * 
 * Direction L Amount 3  R1C1 R1C3 diff R  0   0  C -2  -1  Move  R  0 C -1 To R1C2
 * 
 *      01234        01234        01234
 *   0            0            0
 *   1   HHHH     1    TT      1    T
 *   2   H  H     2      T     2   H
 *   3      H     3      T     3
 *   4      H     4      T     4
 *   5   HHHH     5  TTTT      5
 * 
 * Direction D Amount 1  R2C1 R1C2 diff R  1   1  C -1  -1  Move  R  0 C  0 To R1C2
 * 
 *      01234        01234        01234
 *   0            0            0
 *   1   HHHH     1    TT      1    T
 *   2   HH H     2      T     2    H
 *   3      H     3      T     3
 *   4      H     4      T     4
 *   5   HHHH     5  TTTT      5
 * 
 * Direction R Amount 4  R2C2 R1C2 diff R  1   1  C  0   0  Move  R  0 C  0 To R1C2
 * 
 *      01234        01234        01234
 *   0            0            0
 *   1   HHHH     1    TT      1    T
 *   2   HHHH     2      T     2     H
 *   3      H     3      T     3
 *   4      H     4      T     4
 *   5   HHHH     5  TTTT      5
 * 
 * Direction R Amount 4  R2C3 R1C2 diff R  1   1  C  1   1  Move  R  0 C  0 To R1C2
 * 
 *      01234        01234        01234
 *   0            0            0
 *   1   HHHH     1    TT      1
 *   2   HHHH     2     TT     2     TH
 *   3      H     3      T     3
 *   4      H     4      T     4
 *   5   HHHH     5  TTTT      5
 * 
 * Direction R Amount 4  R2C4 R1C2 diff R  1   1  C  2   1  Move  R  1 C  1 To R2C3
 * 
 *      012345        012345        012345
 *   0             0             0
 *   1   HHHH      1    TT       1
 *   2   HHHHH     2     TT      2      TH
 *   3      H      3      T      3
 *   4      H      4      T      4
 *   5   HHHH      5  TTTT       5
 * 
 * Direction R Amount 4  R2C5 R2C3 diff R  0   0  C  2   1  Move  R  0 C  1 To R2C4
 * 
 *      012345        012345        012345
 *   0             0             0
 *   1   HHHH      1    TT       1
 *   2   HHHHH     2     TT      2      T
 *   3      HH     3      T      3       H
 *   4      H      4      T      4
 *   5   HHHH      5  TTTT       5
 * 
 * Direction D Amount 1  R3C5 R2C4 diff R  1   1  C  1   1  Move  R  0 C  0 To R2C4
 * 
 *      012345        012345        012345
 *   0             0             0
 *   1   HHHH      1    TT       1
 *   2   HHHHH     2     TT      2      T
 *   3      HH     3      T      3      H
 *   4      H      4      T      4
 *   5   HHHH      5  TTTT       5
 * 
 * Direction L Amount 5  R3C4 R2C4 diff R  1   1  C  0   0  Move  R  0 C  0 To R2C4
 * 
 *      012345        012345        012345
 *   0             0             0
 *   1   HHHH      1    TT       1
 *   2   HHHHH     2     TT      2      T
 *   3     HHH     3      T      3     H
 *   4      H      4      T      4
 *   5   HHHH      5  TTTT       5
 * 
 * Direction L Amount 5  R3C3 R2C4 diff R  1   1  C -1  -1  Move  R  0 C  0 To R2C4
 * 
 *      012345        012345        012345
 *   0             0             0
 *   1   HHHH      1    TT       1
 *   2   HHHHH     2     TT      2
 *   3    HHHH     3     TT      3    HT
 *   4      H      4      T      4
 *   5   HHHH      5  TTTT       5
 * 
 * Direction L Amount 5  R3C2 R2C4 diff R  1   1  C -2  -1  Move  R  1 C -1 To R3C3
 * 
 *      012345        012345        012345
 *   0             0             0
 *   1   HHHH      1    TT       1
 *   2   HHHHH     2     TT      2
 *   3   HHHHH     3    TTT      3   HT
 *   4      H      4      T      4
 *   5   HHHH      5  TTTT       5
 * 
 * Direction L Amount 5  R3C1 R3C3 diff R  0   0  C -2  -1  Move  R  0 C -1 To R3C2
 * 
 *      012345        012345        012345
 *   0             0             0
 *   1   HHHH      1    TT       1
 *   2   HHHHH     2     TT      2
 *   3  HHHHHH     3   TTTT      3  HT
 *   4      H      4      T      4
 *   5   HHHH      5  TTTT       5
 * 
 * Direction L Amount 5  R3C0 R3C2 diff R  0   0  C -2  -1  Move  R  0 C -1 To R3C1
 * 
 *      012345        012345        012345
 *   0             0             0
 *   1   HHHH      1    TT       1
 *   2   HHHHH     2     TT      2
 *   3  HHHHHH     3   TTTT      3   T
 *   4      H      4      T      4
 *   5   HHHH      5  TTTT       5
 * 
 * Direction R Amount 2  R3C1 R3C1 diff R  0   0  C  0   0  Move  R  0 C  0 To R3C1
 * 
 *      012345        012345        012345
 *   0             0             0
 *   1   HHHH      1    TT       1
 *   2   HHHHH     2     TT      2
 *   3  HHHHHH     3   TTTT      3   TH
 *   4      H      4      T      4
 *   5   HHHH      5  TTTT       5
 * 
 * Direction R Amount 2  R3C2 R3C1 diff R  0   0  C  1   1  Move  R  0 C  0 To R3C1
 * 
 *      012345        012345        012345
 *   0             0             0
 *   1   HHHH      1    TT       1
 *   2   HHHHH     2     TT      2
 *   3  HHHHHH     3   TTTT      3   TH
 *   4      H      4      T      4
 *   5   HHHH      5  TTTT       5
 * 
 * Result Part 1 = 13
 * Result Part 2 = 0
 * 
 * Day 09 - Ende
 * 
 */
