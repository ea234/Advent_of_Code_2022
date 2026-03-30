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

let file_string     : string  = "";
let file_write_on   : boolean = true;

const CHAR_MAP_HEAD : string = "H";
const CHAR_MAP_TAIL : string = "T";
const CHAR_MAP_FREE : string = " ";

const INDEX_HEAD    : number = 1;
const INDEX_START   : number = 0;

const STR_COMBINE_SPACER : string = "   "; 

type PropertieMap = Record< string, string >;

type Coords = { row : number; col : number, char : string };

class RopeBridge
{
    vector_coords : Coords[] = [];

    map_tail      : PropertieMap = {};

    map_head      : PropertieMap = {};

    grid_min_row  : number = 0;

    grid_min_col  : number = 0;

    grid_max_rows : number = 1;

    grid_max_cols : number = 1;

    constructor( pMapRow : number, pMapCol : number, pLength : number )
    {
        for ( let cur_index : number = 0; cur_index <= pLength; cur_index++ )
        {
            this.vector_coords[ cur_index ] = { row : pMapRow, col : pMapCol, char : "" + ( cur_index -1 ) }
        }

        this.vector_coords[ INDEX_START ]!.char = "S"; // Index 0 remembers the start position
        this.vector_coords[ INDEX_HEAD  ]!.char = "H"; // Index 1 is the Head
        this.vector_coords[ pLength     ]!.char = "T"; // Last index is the tail

        console.log( this.vector_coords );
    }

    public getHeadMap() : PropertieMap 
    {
        return this.map_head;
    }

    public getTailMap() : PropertieMap 
    {
        return this.map_tail;
    }

    public getKeyIndex( pIndex : number ) : string 
    {
        return "R" + this.vector_coords[ pIndex ]!.row + "C" + this.vector_coords[ pIndex ]!.col;
    }

    public getMapHeadKey() : string 
    {
        return this.getKeyIndex( INDEX_HEAD );
    }

    public getMapTailKey() : string 
    {
        return this.getKeyIndex( this.vector_coords.length - 1 );
    }

    private checkGridMinMax()
    {
        for ( let cur_index : number = 0; cur_index < this.vector_coords.length; cur_index++ )
        {
            if (  this.vector_coords[ cur_index ]!.row < this.grid_min_row )
            {
                this.grid_min_row = this.vector_coords[ cur_index ]!.row - 2;
            }

            if ( this.vector_coords[ cur_index ]!.col < this.grid_min_col )
            {
                this.grid_min_col = this.vector_coords[ cur_index ]!.col - 2;
            }

            if ( this.vector_coords[ cur_index ]!.row > this.grid_max_rows )
            {
                this.grid_max_rows = this.vector_coords[ cur_index ]!.row + 3;
            }

            if ( this.vector_coords[ cur_index ]!.col > this.grid_max_cols )
            {
                this.grid_max_cols = this.vector_coords[ cur_index ]!.col + 3;
            }
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

    public getDebugGridBoth() : string 
    {
        let map_both : PropertieMap = {};

        for ( let cur_index : number = 2; cur_index < this.vector_coords.length; cur_index++ )
        {
            map_both[ this.getKeyIndex( cur_index ) ] = this.vector_coords[ cur_index ]!.char;
        }
       
        map_both[ this.getMapHeadKey() ] = CHAR_MAP_HEAD;
        
        map_both[ this.getMapTailKey() ] = CHAR_MAP_TAIL;

        map_both[ this.getKeyIndex( 0 ) ] = this.vector_coords[ 0 ]!.char;

        return getDebugMap( map_both, this.grid_min_row, this.grid_min_col, this.grid_max_rows, this.grid_max_cols ); 
    }

    public getDebugMaps() : string 
    {
        let dbg_map_head : string = this.getDebugGridHead(); 

        let dbg_map_tail : string = this.getDebugGridTail(); 

        let dbg_map_both : string = this.getDebugGridBoth(); 

        return combineStrings( combineStrings( dbg_map_head, dbg_map_tail ), dbg_map_both ) + "\n";
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
                this.vector_coords[ INDEX_HEAD ]!.row  += step_direction;

                this.map_head[ this.getMapHeadKey() ] = CHAR_MAP_HEAD;

                let dbg_string_temp = dbg_string + this.moveTails( pKnzDebug );

                this.map_head[ this.getMapHeadKey() ] = CHAR_MAP_HEAD;

                this.map_head[ this.getKeyIndex( INDEX_START ) ] = "S";

                if ( pKnzDebug )
                {
                    wl( this.getDebugMaps() + "\n" + dbg_string_temp + "\n" );
                }
            }
        }

        if ( delta_move_col > 0 )
        {
            for( let step_count = 0; step_count < delta_move_col; step_count++ )
            {
                this.vector_coords[ INDEX_HEAD ]!.col += step_direction;

                let dbg_string_temp = dbg_string + this.moveTails( pKnzDebug );

                this.map_head[ this.getMapHeadKey() ] = CHAR_MAP_HEAD;

                this.map_head[ this.getKeyIndex( INDEX_START ) ] = "S";

                if ( pKnzDebug )
                {
                    wl( this.getDebugMaps() + "\n" + dbg_string_temp + "\n" );
                }
            }
        }
    }

    private moveTails( pKnzDebug : boolean ) : string 
    {
        let dbg_string : string = "";

        let cr_str : string = "\n";

        for ( let cur_index : number = 2; cur_index < this.vector_coords.length; cur_index++ )
        {
            dbg_string += cr_str + this.moveTail( cur_index, pKnzDebug );
        }

        this.checkGridMinMax();

        return dbg_string;
    }

    private moveTail( pIndexCur : number, pKnzDebug : boolean ) : string 
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
        let delta_row_diff : number = this.vector_coords[ pIndexCur - 1 ]!.row - this.vector_coords[ pIndexCur ]!.row;

        let direction_row  : number = Math.sign( delta_row_diff );

        let delta_row_step : number = 0;


        let delta_col_diff : number = this.vector_coords[ pIndexCur - 1 ]!.col - this.vector_coords[ pIndexCur ]!.col;

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

        let dbg_string : string = pKnzDebug ? " " + padR( this.getKeyIndex( pIndexCur - 1 ), 7 )  + " " + padR( this.getKeyIndex( pIndexCur ), 7 ) : "";
        
        this.vector_coords[ pIndexCur ]!.row += delta_row_step;

        this.vector_coords[ pIndexCur ]!.col += delta_col_step;

        if ( pKnzDebug )
        {
            dbg_string += " diff R "   + padL( delta_row_diff, 2 ) + "  "  + padL( direction_row,  2 );
            dbg_string += "  C "       + padL( delta_col_diff, 2 ) + "  "  + padL( direction_col,  2 );
            dbg_string += "  Move  R " + padL( delta_row_step, 2 ) + " C " + padL( delta_col_step, 2 );
            dbg_string += " To " + this.getKeyIndex( pIndexCur );
        }

        if ( this.vector_coords[ pIndexCur ]!.char === CHAR_MAP_TAIL )
        {
            this.map_tail[ this.getKeyIndex( pIndexCur) ] = this.vector_coords[ pIndexCur ]!.char;
        }
        else
        {
            this.map_head[ this.getKeyIndex( pIndexCur) ] = this.vector_coords[ pIndexCur ]!.char;
        }

        return dbg_string
    }

    public toString() : string 
    {
        return "Head " + this.getMapHeadKey() + " Tail " + this.getMapTailKey();
    }
}

function wl( pString : string )
{
    console.log( pString );

    if ( file_write_on )
    {
        file_string +="\n" + pString;
    }
}


function writeFile( pFileName: string, pFileData: string ): void 
{
    if ( file_write_on )
    {
        fs.writeFile( pFileName, pFileData, { flag: "w" } );

        console.log( "File " + pFileName + " created!" );
    }
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
    
    let rope_bridge_part_1 : RopeBridge = new RopeBridge( start_row, start_col, 2  );

    let rope_bridge_part_2 : RopeBridge = new RopeBridge( start_row, start_col, 10 );

    for ( const cur_input_str of pArray ) 
    {
        let [ s_direction, s_value ] = cur_input_str.trim().split( " " );

        rope_bridge_part_1.moveHead( s_direction!, s_value!, pKnzDebug );
    }

    /*
     * Two seperate loops for the movements for part 1 and part 2, to prevent 
     * an entanglement with the debug-output.
     */

    wl( "" );

    for ( const cur_input_str of pArray ) 
    {
        let [ s_direction, s_value ] = cur_input_str.trim().split( " " );

        rope_bridge_part_2.moveHead( s_direction!, s_value!, pKnzDebug );
    }

    /*
     * *******************************************************************************************************
     * Creating debug-maps for character counting
     * *******************************************************************************************************
     */

    result_part_01 = rope_bridge_part_1.countTailPath();

    result_part_02 = rope_bridge_part_2.countTailPath();

    wl( "" );

    if ( pKnzDebug )
    {
        wl( "" );
        wl( rope_bridge_part_1.getDebugMaps() );
        wl( "" );
    }

    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
    wl( "" );
    wl( "" );
    wl( "" );

    writeFile( "/home/ea234/typescript/day09_log_file.txt", file_string );
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


function getTestArray2() : string[] 
{
    const array_test: string[] = [];

    array_test.push( "R 5" );
    array_test.push( "U 8" );
    array_test.push( "L 8" );
    array_test.push( "D 3" );
    array_test.push( "R 17" );
    array_test.push( "D 10" );
    array_test.push( "L 25" );
    array_test.push( "U 20" );

    return array_test;
}


wl( "" );
wl( "Day 09 - Rope Bridge" );
wl( "" );

calcArray( getTestArray2(), true );

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
 * 
 * ----------------------------------------------------------------------------
 * 

 * 
 * Day 09 - Rope Bridge
 * 
 *      0        0        0
 *   0        0        0   
 *   1        1        1   
 *   2  S     2  T     2  S
 *   3        3        3   
 *   4        4        4   
 * 
 * Direction R Amount 5 
 *  R2C1    R2C0    diff R  0   0  C  1   1  Move  R  0 C  0 To R2C0
 * 
 *      01234        01234        01234
 *   0            0            0       
 *   1            1            1       
 *   2  SHH       2  TT        2  STH  
 *   3            3            3       
 *   4            4            4       
 * 
 * Direction R Amount 5 
 *  R2C2    R2C0    diff R  0   0  C  2   1  Move  R  0 C  1 To R2C1
 * 
 *      01234        01234        01234
 *   0            0            0       
 *   1            1            1       
 *   2  SHHH      2  TTT       2  S TH 
 *   3            3            3       
 *   4            4            4       
 * 
 * Direction R Amount 5 
 *  R2C3    R2C1    diff R  0   0  C  2   1  Move  R  0 C  1 To R2C2
 * 
 *      01234        01234        01234
 *   0            0            0       
 *   1            1            1       
 *   2  SHHHH     2  TTTT      2  S  TH
 *   3            3            3       
 *   4            4            4       
 * 
 * Direction R Amount 5 
 *  R2C4    R2C2    diff R  0   0  C  2   1  Move  R  0 C  1 To R2C3
 * 
 *      01234        01234        01234
 *   0            0            0       
 *   1            1            1       
 *   2  SHHHH     2  TTTTT     2  S   T
 *   3            3            3       
 *   4            4            4       
 * 
 * Direction R Amount 5 
 *  R2C5    R2C3    diff R  0   0  C  2   1  Move  R  0 C  1 To R2C4
 * 
 *      01234        01234        01234
 *   0            0            0       
 *   1            1            1       
 *   2  SHHHH     2  TTTTT     2  S   T
 *   3            3            3       
 *   4            4            4       
 * 
 * Direction U Amount 8 
 *  R1C5    R2C4    diff R -1  -1  C  1   1  Move  R  0 C  0 To R2C4
 * 
 *      01234        01234        01234
 *   0            0            0       
 *   1            1            1       
 *   2  SHHHH     2  TTTTT     2  S    
 *   3            3            3       
 *   4            4            4       
 * 
 * Direction U Amount 8 
 *  R0C5    R2C4    diff R -2  -1  C  1   1  Move  R -1 C  1 To R1C5
 * 
 *      01234        01234        01234
 *  -3           -3           -3       
 *  -2           -2           -2       
 *  -1           -1           -1       
 *   0            0            0       
 *   1            1            1       
 *   2  SHHHH     2  TTTTT     2  S    
 *   3            3            3       
 *   4            4            4       
 * 
 * Direction U Amount 8 
 *  R-1C5   R1C5    diff R -2  -1  C  0   0  Move  R -1 C  0 To R0C5
 * 
 *      01234        01234        01234
 *  -3           -3           -3       
 *  -2           -2           -2       
 *  -1           -1           -1       
 *   0            0            0       
 *   1            1            1       
 *   2  SHHHH     2  TTTTT     2  S    
 *   3            3            3       
 *   4            4            4       
 * 
 * Direction U Amount 8 
 *  R-2C5   R0C5    diff R -2  -1  C  0   0  Move  R -1 C  0 To R-1C5
 * 
 *      01234        01234        01234
 *  -3           -3           -3       
 *  -2           -2           -2       
 *  -1           -1           -1       
 *   0            0            0       
 *   1            1            1       
 *   2  SHHHH     2  TTTTT     2  S    
 *   3            3            3       
 *   4            4            4       
 * 
 * Direction U Amount 8 
 *  R-3C5   R-1C5   diff R -2  -1  C  0   0  Move  R -1 C  0 To R-2C5
 * 
 *      01234        01234        01234
 *  -6           -6           -6       
 *  -5           -5           -5       
 *  -4           -4           -4       
 *  -3           -3           -3       
 *  -2           -2           -2       
 *  -1           -1           -1       
 *   0            0            0       
 *   1            1            1       
 *   2  SHHHH     2  TTTTT     2  S    
 *   3            3            3       
 *   4            4            4       
 * 
 * Direction U Amount 8 
 *  R-4C5   R-2C5   diff R -2  -1  C  0   0  Move  R -1 C  0 To R-3C5
 * 
 *      01234        01234        01234
 *  -6           -6           -6       
 *  -5           -5           -5       
 *  -4           -4           -4       
 *  -3           -3           -3       
 *  -2           -2           -2       
 *  -1           -1           -1       
 *   0            0            0       
 *   1            1            1       
 *   2  SHHHH     2  TTTTT     2  S    
 *   3            3            3       
 *   4            4            4       
 * 
 * Direction U Amount 8 
 *  R-5C5   R-3C5   diff R -2  -1  C  0   0  Move  R -1 C  0 To R-4C5
 * 
 *      01234        01234        01234
 *  -6           -6           -6       
 *  -5           -5           -5       
 *  -4           -4           -4       
 *  -3           -3           -3       
 *  -2           -2           -2       
 *  -1           -1           -1       
 *   0            0            0       
 *   1            1            1       
 *   2  SHHHH     2  TTTTT     2  S    
 *   3            3            3       
 *   4            4            4       
 * 
 * Direction U Amount 8 
 *  R-6C5   R-4C5   diff R -2  -1  C  0   0  Move  R -1 C  0 To R-5C5
 * 
 *      01234        01234        01234
 *  -6      H    -6           -6      H
 *  -5           -5           -5       
 *  -4           -4           -4       
 *  -3           -3           -3       
 *  -2           -2           -2       
 *  -1           -1           -1       
 *   0            0            0       
 *   1            1            1       
 *   2  SHHHH     2  TTTTT     2  S    
 *   3            3            3       
 *   4            4            4       
 * 
 * Direction L Amount 8 
 *  R-6C4   R-5C5   diff R -1  -1  C -1  -1  Move  R  0 C  0 To R-5C5
 * 
 *      01234        01234        01234
 *  -6     HH    -6      T    -6     HT
 *  -5           -5           -5       
 *  -4           -4           -4       
 *  -3           -3           -3       
 *  -2           -2           -2       
 *  -1           -1           -1       
 *   0            0            0       
 *   1            1            1       
 *   2  SHHHH     2  TTTTT     2  S    
 *   3            3            3       
 *   4            4            4       
 * 
 * Direction L Amount 8 
 *  R-6C3   R-5C5   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R-6C4
 * 
 *      01234        01234        01234
 *  -6    HHH    -6     TT    -6    HT 
 *  -5           -5           -5       
 *  -4           -4           -4       
 *  -3           -3           -3       
 *  -2           -2           -2       
 *  -1           -1           -1       
 *   0            0            0       
 *   1            1            1       
 *   2  SHHHH     2  TTTTT     2  S    
 *   3            3            3       
 *   4            4            4       
 * 
 * Direction L Amount 8 
 *  R-6C2   R-6C4   diff R  0   0  C -2  -1  Move  R  0 C -1 To R-6C3
 * 
 *      01234        01234        01234
 *  -6   HHHH    -6    TTT    -6   HT  
 *  -5           -5           -5       
 *  -4           -4           -4       
 *  -3           -3           -3       
 *  -2           -2           -2       
 *  -1           -1           -1       
 *   0            0            0       
 *   1            1            1       
 *   2  SHHHH     2  TTTTT     2  S    
 *   3            3            3       
 *   4            4            4       
 * 
 * Direction L Amount 8 
 *  R-6C1   R-6C3   diff R  0   0  C -2  -1  Move  R  0 C -1 To R-6C2
 * 
 *      01234        01234        01234
 *  -6  HHHHH    -6   TTTT    -6  HT   
 *  -5           -5           -5       
 *  -4           -4           -4       
 *  -3           -3           -3       
 *  -2           -2           -2       
 *  -1           -1           -1       
 *   0            0            0       
 *   1            1            1       
 *   2  SHHHH     2  TTTTT     2  S    
 *   3            3            3       
 *   4            4            4       
 * 
 * Direction L Amount 8 
 *  R-6C0   R-6C2   diff R  0   0  C -2  -1  Move  R  0 C -1 To R-6C1
 * 
 *      32101234        32101234        32101234
 *  -6    HHHHHH    -6     TTTTT    -6    HT    
 *  -5              -5              -5          
 *  -4              -4              -4          
 *  -3              -3              -3          
 *  -2              -2              -2          
 *  -1              -1              -1          
 *   0               0               0          
 *   1               1               1          
 *   2     SHHHH     2     TTTTT     2     S    
 *   3               3               3          
 *   4               4               4          
 * 
 * Direction L Amount 8 
 *  R-6C-1  R-6C1   diff R  0   0  C -2  -1  Move  R  0 C -1 To R-6C0
 * 
 *      32101234        32101234        32101234
 *  -6   HHHHHHH    -6    TTTTTT    -6   HT     
 *  -5              -5              -5          
 *  -4              -4              -4          
 *  -3              -3              -3          
 *  -2              -2              -2          
 *  -1              -1              -1          
 *   0               0               0          
 *   1               1               1          
 *   2     SHHHH     2     TTTTT     2     S    
 *   3               3               3          
 *   4               4               4          
 * 
 * Direction L Amount 8 
 *  R-6C-2  R-6C0   diff R  0   0  C -2  -1  Move  R  0 C -1 To R-6C-1
 * 
 *      32101234        32101234        32101234
 *  -6  HHHHHHHH    -6   TTTTTTT    -6  HT      
 *  -5              -5              -5          
 *  -4              -4              -4          
 *  -3              -3              -3          
 *  -2              -2              -2          
 *  -1              -1              -1          
 *   0               0               0          
 *   1               1               1          
 *   2     SHHHH     2     TTTTT     2     S    
 *   3               3               3          
 *   4               4               4          
 * 
 * Direction L Amount 8 
 *  R-6C-3  R-6C-1  diff R  0   0  C -2  -1  Move  R  0 C -1 To R-6C-2
 * 
 *      32101234        32101234        32101234
 *  -6  HHHHHHHH    -6   TTTTTTT    -6   T      
 *  -5  H           -5              -5  H       
 *  -4              -4              -4          
 *  -3              -3              -3          
 *  -2              -2              -2          
 *  -1              -1              -1          
 *   0               0               0          
 *   1               1               1          
 *   2     SHHHH     2     TTTTT     2     S    
 *   3               3               3          
 *   4               4               4          
 * 
 * Direction D Amount 3 
 *  R-5C-3  R-6C-2  diff R  1   1  C -1  -1  Move  R  0 C  0 To R-6C-2
 * 
 *      32101234        32101234        32101234
 *  -6  HHHHHHHH    -6   TTTTTTT    -6          
 *  -5  H           -5  T           -5  T       
 *  -4  H           -4              -4  H       
 *  -3              -3              -3          
 *  -2              -2              -2          
 *  -1              -1              -1          
 *   0               0               0          
 *   1               1               1          
 *   2     SHHHH     2     TTTTT     2     S    
 *   3               3               3          
 *   4               4               4          
 * 
 * Direction D Amount 3 
 *  R-4C-3  R-6C-2  diff R  2   1  C -1  -1  Move  R  1 C -1 To R-5C-3
 * 
 *      32101234        32101234        32101234
 *  -6  HHHHHHHH    -6   TTTTTTT    -6          
 *  -5  H           -5  T           -5          
 *  -4  H           -4  T           -4  T       
 *  -3  H           -3              -3  H       
 *  -2              -2              -2          
 *  -1              -1              -1          
 *   0               0               0          
 *   1               1               1          
 *   2     SHHHH     2     TTTTT     2     S    
 *   3               3               3          
 *   4               4               4          
 * 
 * Direction D Amount 3 
 *  R-3C-3  R-5C-3  diff R  2   1  C  0   0  Move  R  1 C  0 To R-4C-3
 * 
 *      32101234        32101234        32101234
 *  -6  HHHHHHHH    -6   TTTTTTT    -6          
 *  -5  H           -5  T           -5          
 *  -4  H           -4  T           -4  T       
 *  -3  HH          -3              -3   H      
 *  -2              -2              -2          
 *  -1              -1              -1          
 *   0               0               0          
 *   1               1               1          
 *   2     SHHHH     2     TTTTT     2     S    
 *   3               3               3          
 *   4               4               4          
 * 
 * Direction R Amount 17 
 *  R-3C-2  R-4C-3  diff R  1   1  C  1   1  Move  R  0 C  0 To R-4C-3
 * 
 *      32101234        32101234        32101234
 *  -6  HHHHHHHH    -6   TTTTTTT    -6          
 *  -5  H           -5  T           -5          
 *  -4  H           -4  T           -4          
 *  -3  HHH         -3   T          -3   TH     
 *  -2              -2              -2          
 *  -1              -1              -1          
 *   0               0               0          
 *   1               1               1          
 *   2     SHHHH     2     TTTTT     2     S    
 *   3               3               3          
 *   4               4               4          
 * 
 * Direction R Amount 17 
 *  R-3C-1  R-4C-3  diff R  1   1  C  2   1  Move  R  1 C  1 To R-3C-2
 * 
 *      32101234        32101234        32101234
 *  -6  HHHHHHHH    -6   TTTTTTT    -6          
 *  -5  H           -5  T           -5          
 *  -4  H           -4  T           -4          
 *  -3  HHHH        -3   TT         -3    TH    
 *  -2              -2              -2          
 *  -1              -1              -1          
 *   0               0               0          
 *   1               1               1          
 *   2     SHHHH     2     TTTTT     2     S    
 *   3               3               3          
 *   4               4               4          
 * 
 * Direction R Amount 17 
 *  R-3C0   R-3C-2  diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C-1
 * 
 *      32101234        32101234        32101234
 *  -6  HHHHHHHH    -6   TTTTTTT    -6          
 *  -5  H           -5  T           -5          
 *  -4  H           -4  T           -4          
 *  -3  HHHHH       -3   TTT        -3     TH   
 *  -2              -2              -2          
 *  -1              -1              -1          
 *   0               0               0          
 *   1               1               1          
 *   2     SHHHH     2     TTTTT     2     S    
 *   3               3               3          
 *   4               4               4          
 * 
 * Direction R Amount 17 
 *  R-3C1   R-3C-1  diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C0
 * 
 *      32101234        32101234        32101234
 *  -6  HHHHHHHH    -6   TTTTTTT    -6          
 *  -5  H           -5  T           -5          
 *  -4  H           -4  T           -4          
 *  -3  HHHHHH      -3   TTTT       -3      TH  
 *  -2              -2              -2          
 *  -1              -1              -1          
 *   0               0               0          
 *   1               1               1          
 *   2     SHHHH     2     TTTTT     2     S    
 *   3               3               3          
 *   4               4               4          
 * 
 * Direction R Amount 17 
 *  R-3C2   R-3C0   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C1
 * 
 *      32101234        32101234        32101234
 *  -6  HHHHHHHH    -6   TTTTTTT    -6          
 *  -5  H           -5  T           -5          
 *  -4  H           -4  T           -4          
 *  -3  HHHHHHH     -3   TTTTT      -3       TH 
 *  -2              -2              -2          
 *  -1              -1              -1          
 *   0               0               0          
 *   1               1               1          
 *   2     SHHHH     2     TTTTT     2     S    
 *   3               3               3          
 *   4               4               4          
 * 
 * Direction R Amount 17 
 *  R-3C3   R-3C1   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C2
 * 
 *      32101234        32101234        32101234
 *  -6  HHHHHHHH    -6   TTTTTTT    -6          
 *  -5  H           -5  T           -5          
 *  -4  H           -4  T           -4          
 *  -3  HHHHHHHH    -3   TTTTTT     -3        TH
 *  -2              -2              -2          
 *  -1              -1              -1          
 *   0               0               0          
 *   1               1               1          
 *   2     SHHHH     2     TTTTT     2     S    
 *   3               3               3          
 *   4               4               4          
 * 
 * Direction R Amount 17 
 *  R-3C4   R-3C2   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C3
 * 
 *      32101234        32101234        32101234
 *  -6  HHHHHHHH    -6   TTTTTTT    -6          
 *  -5  H           -5  T           -5          
 *  -4  H           -4  T           -4          
 *  -3  HHHHHHHH    -3   TTTTTTT    -3         T
 *  -2              -2              -2          
 *  -1              -1              -1          
 *   0               0               0          
 *   1               1               1          
 *   2     SHHHH     2     TTTTT     2     S    
 *   3               3               3          
 *   4               4               4          
 * 
 * Direction R Amount 17 
 *  R-3C5   R-3C3   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C4
 * 
 *      321012345678        321012345678        321012345678
 *  -6  HHHHHHHHH       -6   TTTTTTT        -6              
 *  -5  H       H       -5  T       T       -5              
 *  -4  H       H       -4  T       T       -4              
 *  -3  HHHHHHHHHH      -3   TTTTTTTT       -3          TH  
 *  -2          H       -2          T       -2              
 *  -1          H       -1          T       -1              
 *   0          H        0          T        0              
 *   1          H        1          T        1              
 *   2     SHHHHH        2     TTTTT         2     S        
 *   3                   3                   3              
 *   4                   4                   4              
 * 
 * Direction R Amount 17 
 *  R-3C6   R-3C4   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C5
 * 
 *      321012345678        321012345678        321012345678
 *  -6  HHHHHHHHH       -6   TTTTTTT        -6              
 *  -5  H       H       -5  T       T       -5              
 *  -4  H       H       -4  T       T       -4              
 *  -3  HHHHHHHHHHH     -3   TTTTTTTTT      -3           TH 
 *  -2          H       -2          T       -2              
 *  -1          H       -1          T       -1              
 *   0          H        0          T        0              
 *   1          H        1          T        1              
 *   2     SHHHHH        2     TTTTT         2     S        
 *   3                   3                   3              
 *   4                   4                   4              
 * 
 * Direction R Amount 17 
 *  R-3C7   R-3C5   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C6
 * 
 *      321012345678        321012345678        321012345678
 *  -6  HHHHHHHHH       -6   TTTTTTT        -6              
 *  -5  H       H       -5  T       T       -5              
 *  -4  H       H       -4  T       T       -4              
 *  -3  HHHHHHHHHHHH    -3   TTTTTTTTTT     -3            TH
 *  -2          H       -2          T       -2              
 *  -1          H       -1          T       -1              
 *   0          H        0          T        0              
 *   1          H        1          T        1              
 *   2     SHHHHH        2     TTTTT         2     S        
 *   3                   3                   3              
 *   4                   4                   4              
 * 
 * Direction R Amount 17 
 *  R-3C8   R-3C6   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C7
 * 
 *      321012345678        321012345678        321012345678
 *  -6  HHHHHHHHH       -6   TTTTTTT        -6              
 *  -5  H       H       -5  T       T       -5              
 *  -4  H       H       -4  T       T       -4              
 *  -3  HHHHHHHHHHHH    -3   TTTTTTTTTTT    -3             T
 *  -2          H       -2          T       -2              
 *  -1          H       -1          T       -1              
 *   0          H        0          T        0              
 *   1          H        1          T        1              
 *   2     SHHHHH        2     TTTTT         2     S        
 *   3                   3                   3              
 *   4                   4                   4              
 * 
 * Direction R Amount 17 
 *  R-3C9   R-3C7   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C8
 * 
 *      3210123456789012        3210123456789012        3210123456789012
 *  -6  HHHHHHHHH           -6   TTTTTTT            -6                  
 *  -5  H       H           -5  T       T           -5                  
 *  -4  H       H           -4  T       T           -4                  
 *  -3  HHHHHHHHHHHHHH      -3   TTTTTTTTTTTT       -3              TH  
 *  -2          H           -2          T           -2                  
 *  -1          H           -1          T           -1                  
 *   0          H            0          T            0                  
 *   1          H            1          T            1                  
 *   2     SHHHHH            2     TTTTT             2     S            
 *   3                       3                       3                  
 *   4                       4                       4                  
 * 
 * Direction R Amount 17 
 *  R-3C10  R-3C8   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C9
 * 
 *      3210123456789012        3210123456789012        3210123456789012
 *  -6  HHHHHHHHH           -6   TTTTTTT            -6                  
 *  -5  H       H           -5  T       T           -5                  
 *  -4  H       H           -4  T       T           -4                  
 *  -3  HHHHHHHHHHHHHHH     -3   TTTTTTTTTTTTT      -3               TH 
 *  -2          H           -2          T           -2                  
 *  -1          H           -1          T           -1                  
 *   0          H            0          T            0                  
 *   1          H            1          T            1                  
 *   2     SHHHHH            2     TTTTT             2     S            
 *   3                       3                       3                  
 *   4                       4                       4                  
 * 
 * Direction R Amount 17 
 *  R-3C11  R-3C9   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C10
 * 
 *      3210123456789012        3210123456789012        3210123456789012
 *  -6  HHHHHHHHH           -6   TTTTTTT            -6                  
 *  -5  H       H           -5  T       T           -5                  
 *  -4  H       H           -4  T       T           -4                  
 *  -3  HHHHHHHHHHHHHHHH    -3   TTTTTTTTTTTTTT     -3                TH
 *  -2          H           -2          T           -2                  
 *  -1          H           -1          T           -1                  
 *   0          H            0          T            0                  
 *   1          H            1          T            1                  
 *   2     SHHHHH            2     TTTTT             2     S            
 *   3                       3                       3                  
 *   4                       4                       4                  
 * 
 * Direction R Amount 17 
 *  R-3C12  R-3C10  diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C11
 * 
 *      3210123456789012        3210123456789012        3210123456789012
 *  -6  HHHHHHHHH           -6   TTTTTTT            -6                  
 *  -5  H       H           -5  T       T           -5                  
 *  -4  H       H           -4  T       T           -4                  
 *  -3  HHHHHHHHHHHHHHHH    -3   TTTTTTTTTTTTTTT    -3                 T
 *  -2          H           -2          T           -2                  
 *  -1          H           -1          T           -1                  
 *   0          H            0          T            0                  
 *   1          H            1          T            1                  
 *   2     SHHHHH            2     TTTTT             2     S            
 *   3                       3                       3                  
 *   4                       4                       4                  
 * 
 * Direction R Amount 17 
 *  R-3C13  R-3C11  diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C12
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  HHHHHHHHH               -6   TTTTTTT                -6                      
 *  -5  H       H               -5  T       T               -5                      
 *  -4  H       H               -4  T       T               -4                      
 *  -3  HHHHHHHHHHHHHHHHHH      -3   TTTTTTTTTTTTTTTT       -3                  TH  
 *  -2          H               -2          T               -2                      
 *  -1          H               -1          T               -1                      
 *   0          H                0          T                0                      
 *   1          H                1          T                1                      
 *   2     SHHHHH                2     TTTTT                 2     S                
 *   3                           3                           3                      
 *   4                           4                           4                      
 * 
 * Direction R Amount 17 
 *  R-3C14  R-3C12  diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C13
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  HHHHHHHHH               -6   TTTTTTT                -6                      
 *  -5  H       H               -5  T       T               -5                      
 *  -4  H       H               -4  T       T               -4                      
 *  -3  HHHHHHHHHHHHHHHHHH      -3   TTTTTTTTTTTTTTTT       -3                  T   
 *  -2          H        H      -2          T               -2                   H  
 *  -1          H               -1          T               -1                      
 *   0          H                0          T                0                      
 *   1          H                1          T                1                      
 *   2     SHHHHH                2     TTTTT                 2     S                
 *   3                           3                           3                      
 *   4                           4                           4                      
 * 
 * Direction D Amount 10 
 *  R-2C14  R-3C13  diff R  1   1  C  1   1  Move  R  0 C  0 To R-3C13
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  HHHHHHHHH               -6   TTTTTTT                -6                      
 *  -5  H       H               -5  T       T               -5                      
 *  -4  H       H               -4  T       T               -4                      
 *  -3  HHHHHHHHHHHHHHHHHH      -3   TTTTTTTTTTTTTTTT       -3                      
 *  -2          H        H      -2          T        T      -2                   T  
 *  -1          H        H      -1          T               -1                   H  
 *   0          H                0          T                0                      
 *   1          H                1          T                1                      
 *   2     SHHHHH                2     TTTTT                 2     S                
 *   3                           3                           3                      
 *   4                           4                           4                      
 * 
 * Direction D Amount 10 
 *  R-1C14  R-3C13  diff R  2   1  C  1   1  Move  R  1 C  1 To R-2C14
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  HHHHHHHHH               -6   TTTTTTT                -6                      
 *  -5  H       H               -5  T       T               -5                      
 *  -4  H       H               -4  T       T               -4                      
 *  -3  HHHHHHHHHHHHHHHHHH      -3   TTTTTTTTTTTTTTTT       -3                      
 *  -2          H        H      -2          T        T      -2                      
 *  -1          H        H      -1          T        T      -1                   T  
 *   0          H        H       0          T                0                   H  
 *   1          H                1          T                1                      
 *   2     SHHHHH                2     TTTTT                 2     S                
 *   3                           3                           3                      
 *   4                           4                           4                      
 * 
 * Direction D Amount 10 
 *  R0C14   R-2C14  diff R  2   1  C  0   0  Move  R  1 C  0 To R-1C14
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  HHHHHHHHH               -6   TTTTTTT                -6                      
 *  -5  H       H               -5  T       T               -5                      
 *  -4  H       H               -4  T       T               -4                      
 *  -3  HHHHHHHHHHHHHHHHHH      -3   TTTTTTTTTTTTTTTT       -3                      
 *  -2          H        H      -2          T        T      -2                      
 *  -1          H        H      -1          T        T      -1                      
 *   0          H        H       0          T        T       0                   T  
 *   1          H        H       1          T                1                   H  
 *   2     SHHHHH                2     TTTTT                 2     S                
 *   3                           3                           3                      
 *   4                           4                           4                      
 * 
 * Direction D Amount 10 
 *  R1C14   R-1C14  diff R  2   1  C  0   0  Move  R  1 C  0 To R0C14
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  HHHHHHHHH               -6   TTTTTTT                -6                      
 *  -5  H       H               -5  T       T               -5                      
 *  -4  H       H               -4  T       T               -4                      
 *  -3  HHHHHHHHHHHHHHHHHH      -3   TTTTTTTTTTTTTTTT       -3                      
 *  -2          H        H      -2          T        T      -2                      
 *  -1          H        H      -1          T        T      -1                      
 *   0          H        H       0          T        T       0                      
 *   1          H        H       1          T        T       1                   T  
 *   2     SHHHHH        H       2     TTTTT                 2     S             H  
 *   3                           3                           3                      
 *   4                           4                           4                      
 * 
 * Direction D Amount 10 
 *  R2C14   R0C14   diff R  2   1  C  0   0  Move  R  1 C  0 To R1C14
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  HHHHHHHHH               -6   TTTTTTT                -6                      
 *  -5  H       H               -5  T       T               -5                      
 *  -4  H       H               -4  T       T               -4                      
 *  -3  HHHHHHHHHHHHHHHHHH      -3   TTTTTTTTTTTTTTTT       -3                      
 *  -2          H        H      -2          T        T      -2                      
 *  -1          H        H      -1          T        T      -1                      
 *   0          H        H       0          T        T       0                      
 *   1          H        H       1          T        T       1                      
 *   2     SHHHHH        H       2     TTTTT         T       2     S             T  
 *   3                   H       3                           3                   H  
 *   4                           4                           4                      
 * 
 * Direction D Amount 10 
 *  R3C14   R1C14   diff R  2   1  C  0   0  Move  R  1 C  0 To R2C14
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  HHHHHHHHH               -6   TTTTTTT                -6                      
 *  -5  H       H               -5  T       T               -5                      
 *  -4  H       H               -4  T       T               -4                      
 *  -3  HHHHHHHHHHHHHHHHHH      -3   TTTTTTTTTTTTTTTT       -3                      
 *  -2          H        H      -2          T        T      -2                      
 *  -1          H        H      -1          T        T      -1                      
 *   0          H        H       0          T        T       0                      
 *   1          H        H       1          T        T       1                      
 *   2     SHHHHH        H       2     TTTTT         T       2     S                
 *   3                   H       3                   T       3                   T  
 *   4                   H       4                           4                   H  
 * 
 * Direction D Amount 10 
 *  R4C14   R2C14   diff R  2   1  C  0   0  Move  R  1 C  0 To R3C14
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  HHHHHHHHH               -6   TTTTTTT                -6                      
 *  -5  H       H               -5  T       T               -5                      
 *  -4  H       H               -4  T       T               -4                      
 *  -3  HHHHHHHHHHHHHHHHHH      -3   TTTTTTTTTTTTTTTT       -3                      
 *  -2          H        H      -2          T        T      -2                      
 *  -1          H        H      -1          T        T      -1                      
 *   0          H        H       0          T        T       0                      
 *   1          H        H       1          T        T       1                      
 *   2     SHHHHH        H       2     TTTTT         T       2     S                
 *   3                   H       3                   T       3                      
 *   4                   H       4                   T       4                   T  
 * 
 * Direction D Amount 10 
 *  R5C14   R3C14   diff R  2   1  C  0   0  Move  R  1 C  0 To R4C14
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  HHHHHHHHH               -6   TTTTTTT                -6                      
 *  -5  H       H               -5  T       T               -5                      
 *  -4  H       H               -4  T       T               -4                      
 *  -3  HHHHHHHHHHHHHHHHHH      -3   TTTTTTTTTTTTTTTT       -3                      
 *  -2          H        H      -2          T        T      -2                      
 *  -1          H        H      -1          T        T      -1                      
 *   0          H        H       0          T        T       0                      
 *   1          H        H       1          T        T       1                      
 *   2     SHHHHH        H       2     TTTTT         T       2     S                
 *   3                   H       3                   T       3                      
 *   4                   H       4                   T       4                      
 *   5                   H       5                   T       5                   T  
 *   6                   H       6                           6                   H  
 *   7                           7                           7                      
 *   8                           8                           8                      
 * 
 * Direction D Amount 10 
 *  R6C14   R4C14   diff R  2   1  C  0   0  Move  R  1 C  0 To R5C14
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  HHHHHHHHH               -6   TTTTTTT                -6                      
 *  -5  H       H               -5  T       T               -5                      
 *  -4  H       H               -4  T       T               -4                      
 *  -3  HHHHHHHHHHHHHHHHHH      -3   TTTTTTTTTTTTTTTT       -3                      
 *  -2          H        H      -2          T        T      -2                      
 *  -1          H        H      -1          T        T      -1                      
 *   0          H        H       0          T        T       0                      
 *   1          H        H       1          T        T       1                      
 *   2     SHHHHH        H       2     TTTTT         T       2     S                
 *   3                   H       3                   T       3                      
 *   4                   H       4                   T       4                      
 *   5                   H       5                   T       5                      
 *   6                   H       6                   T       6                   T  
 *   7                   H       7                           7                   H  
 *   8                           8                           8                      
 * 
 * Direction D Amount 10 
 *  R7C14   R5C14   diff R  2   1  C  0   0  Move  R  1 C  0 To R6C14
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  HHHHHHHHH               -6   TTTTTTT                -6                      
 *  -5  H       H               -5  T       T               -5                      
 *  -4  H       H               -4  T       T               -4                      
 *  -3  HHHHHHHHHHHHHHHHHH      -3   TTTTTTTTTTTTTTTT       -3                      
 *  -2          H        H      -2          T        T      -2                      
 *  -1          H        H      -1          T        T      -1                      
 *   0          H        H       0          T        T       0                      
 *   1          H        H       1          T        T       1                      
 *   2     SHHHHH        H       2     TTTTT         T       2     S                
 *   3                   H       3                   T       3                      
 *   4                   H       4                   T       4                      
 *   5                   H       5                   T       5                      
 *   6                   H       6                   T       6                   T  
 *   7                  HH       7                           7                  H   
 *   8                           8                           8                      
 * 
 * Direction L Amount 25 
 *  R7C13   R6C14   diff R  1   1  C -1  -1  Move  R  0 C  0 To R6C14
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  HHHHHHHHH               -6   TTTTTTT                -6                      
 *  -5  H       H               -5  T       T               -5                      
 *  -4  H       H               -4  T       T               -4                      
 *  -3  HHHHHHHHHHHHHHHHHH      -3   TTTTTTTTTTTTTTTT       -3                      
 *  -2          H        H      -2          T        T      -2                      
 *  -1          H        H      -1          T        T      -1                      
 *   0          H        H       0          T        T       0                      
 *   1          H        H       1          T        T       1                      
 *   2     SHHHHH        H       2     TTTTT         T       2     S                
 *   3                   H       3                   T       3                      
 *   4                   H       4                   T       4                      
 *   5                   H       5                   T       5                      
 *   6                   H       6                   T       6                      
 *   7                 HHH       7                  T        7                 HT   
 *   8                           8                           8                      
 * 
 * Direction L Amount 25 
 *  R7C12   R6C14   diff R  1   1  C -2  -1  Move  R  1 C -1 To R7C13
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  HHHHHHHHH               -6   TTTTTTT                -6                      
 *  -5  H       H               -5  T       T               -5                      
 *  -4  H       H               -4  T       T               -4                      
 *  -3  HHHHHHHHHHHHHHHHHH      -3   TTTTTTTTTTTTTTTT       -3                      
 *  -2          H        H      -2          T        T      -2                      
 *  -1          H        H      -1          T        T      -1                      
 *   0          H        H       0          T        T       0                      
 *   1          H        H       1          T        T       1                      
 *   2     SHHHHH        H       2     TTTTT         T       2     S                
 *   3                   H       3                   T       3                      
 *   4                   H       4                   T       4                      
 *   5                   H       5                   T       5                      
 *   6                   H       6                   T       6                      
 *   7                HHHH       7                 TT        7                HT    
 *   8                           8                           8                      
 * 
 * Direction L Amount 25 
 *  R7C11   R7C13   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C12
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  HHHHHHHHH               -6   TTTTTTT                -6                      
 *  -5  H       H               -5  T       T               -5                      
 *  -4  H       H               -4  T       T               -4                      
 *  -3  HHHHHHHHHHHHHHHHHH      -3   TTTTTTTTTTTTTTTT       -3                      
 *  -2          H        H      -2          T        T      -2                      
 *  -1          H        H      -1          T        T      -1                      
 *   0          H        H       0          T        T       0                      
 *   1          H        H       1          T        T       1                      
 *   2     SHHHHH        H       2     TTTTT         T       2     S                
 *   3                   H       3                   T       3                      
 *   4                   H       4                   T       4                      
 *   5                   H       5                   T       5                      
 *   6                   H       6                   T       6                      
 *   7               HHHHH       7                TTT        7               HT     
 *   8                           8                           8                      
 * 
 * Direction L Amount 25 
 *  R7C10   R7C12   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C11
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  HHHHHHHHH               -6   TTTTTTT                -6                      
 *  -5  H       H               -5  T       T               -5                      
 *  -4  H       H               -4  T       T               -4                      
 *  -3  HHHHHHHHHHHHHHHHHH      -3   TTTTTTTTTTTTTTTT       -3                      
 *  -2          H        H      -2          T        T      -2                      
 *  -1          H        H      -1          T        T      -1                      
 *   0          H        H       0          T        T       0                      
 *   1          H        H       1          T        T       1                      
 *   2     SHHHHH        H       2     TTTTT         T       2     S                
 *   3                   H       3                   T       3                      
 *   4                   H       4                   T       4                      
 *   5                   H       5                   T       5                      
 *   6                   H       6                   T       6                      
 *   7              HHHHHH       7               TTTT        7              HT      
 *   8                           8                           8                      
 * 
 * Direction L Amount 25 
 *  R7C9    R7C11   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C10
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  HHHHHHHHH               -6   TTTTTTT                -6                      
 *  -5  H       H               -5  T       T               -5                      
 *  -4  H       H               -4  T       T               -4                      
 *  -3  HHHHHHHHHHHHHHHHHH      -3   TTTTTTTTTTTTTTTT       -3                      
 *  -2          H        H      -2          T        T      -2                      
 *  -1          H        H      -1          T        T      -1                      
 *   0          H        H       0          T        T       0                      
 *   1          H        H       1          T        T       1                      
 *   2     SHHHHH        H       2     TTTTT         T       2     S                
 *   3                   H       3                   T       3                      
 *   4                   H       4                   T       4                      
 *   5                   H       5                   T       5                      
 *   6                   H       6                   T       6                      
 *   7             HHHHHHH       7              TTTTT        7             HT       
 *   8                           8                           8                      
 * 
 * Direction L Amount 25 
 *  R7C8    R7C10   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C9
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  HHHHHHHHH               -6   TTTTTTT                -6                      
 *  -5  H       H               -5  T       T               -5                      
 *  -4  H       H               -4  T       T               -4                      
 *  -3  HHHHHHHHHHHHHHHHHH      -3   TTTTTTTTTTTTTTTT       -3                      
 *  -2          H        H      -2          T        T      -2                      
 *  -1          H        H      -1          T        T      -1                      
 *   0          H        H       0          T        T       0                      
 *   1          H        H       1          T        T       1                      
 *   2     SHHHHH        H       2     TTTTT         T       2     S                
 *   3                   H       3                   T       3                      
 *   4                   H       4                   T       4                      
 *   5                   H       5                   T       5                      
 *   6                   H       6                   T       6                      
 *   7            HHHHHHHH       7             TTTTTT        7            HT        
 *   8                           8                           8                      
 * 
 * Direction L Amount 25 
 *  R7C7    R7C9    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C8
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  HHHHHHHHH               -6   TTTTTTT                -6                      
 *  -5  H       H               -5  T       T               -5                      
 *  -4  H       H               -4  T       T               -4                      
 *  -3  HHHHHHHHHHHHHHHHHH      -3   TTTTTTTTTTTTTTTT       -3                      
 *  -2          H        H      -2          T        T      -2                      
 *  -1          H        H      -1          T        T      -1                      
 *   0          H        H       0          T        T       0                      
 *   1          H        H       1          T        T       1                      
 *   2     SHHHHH        H       2     TTTTT         T       2     S                
 *   3                   H       3                   T       3                      
 *   4                   H       4                   T       4                      
 *   5                   H       5                   T       5                      
 *   6                   H       6                   T       6                      
 *   7           HHHHHHHHH       7            TTTTTTT        7           HT         
 *   8                           8                           8                      
 * 
 * Direction L Amount 25 
 *  R7C6    R7C8    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C7
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  HHHHHHHHH               -6   TTTTTTT                -6                      
 *  -5  H       H               -5  T       T               -5                      
 *  -4  H       H               -4  T       T               -4                      
 *  -3  HHHHHHHHHHHHHHHHHH      -3   TTTTTTTTTTTTTTTT       -3                      
 *  -2          H        H      -2          T        T      -2                      
 *  -1          H        H      -1          T        T      -1                      
 *   0          H        H       0          T        T       0                      
 *   1          H        H       1          T        T       1                      
 *   2     SHHHHH        H       2     TTTTT         T       2     S                
 *   3                   H       3                   T       3                      
 *   4                   H       4                   T       4                      
 *   5                   H       5                   T       5                      
 *   6                   H       6                   T       6                      
 *   7          HHHHHHHHHH       7           TTTTTTTT        7          HT          
 *   8                           8                           8                      
 * 
 * Direction L Amount 25 
 *  R7C5    R7C7    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C6
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  HHHHHHHHH               -6   TTTTTTT                -6                      
 *  -5  H       H               -5  T       T               -5                      
 *  -4  H       H               -4  T       T               -4                      
 *  -3  HHHHHHHHHHHHHHHHHH      -3   TTTTTTTTTTTTTTTT       -3                      
 *  -2          H        H      -2          T        T      -2                      
 *  -1          H        H      -1          T        T      -1                      
 *   0          H        H       0          T        T       0                      
 *   1          H        H       1          T        T       1                      
 *   2     SHHHHH        H       2     TTTTT         T       2     S                
 *   3                   H       3                   T       3                      
 *   4                   H       4                   T       4                      
 *   5                   H       5                   T       5                      
 *   6                   H       6                   T       6                      
 *   7         HHHHHHHHHHH       7          TTTTTTTTT        7         HT           
 *   8                           8                           8                      
 * 
 * Direction L Amount 25 
 *  R7C4    R7C6    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C5
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  HHHHHHHHH               -6   TTTTTTT                -6                      
 *  -5  H       H               -5  T       T               -5                      
 *  -4  H       H               -4  T       T               -4                      
 *  -3  HHHHHHHHHHHHHHHHHH      -3   TTTTTTTTTTTTTTTT       -3                      
 *  -2          H        H      -2          T        T      -2                      
 *  -1          H        H      -1          T        T      -1                      
 *   0          H        H       0          T        T       0                      
 *   1          H        H       1          T        T       1                      
 *   2     SHHHHH        H       2     TTTTT         T       2     S                
 *   3                   H       3                   T       3                      
 *   4                   H       4                   T       4                      
 *   5                   H       5                   T       5                      
 *   6                   H       6                   T       6                      
 *   7        HHHHHHHHHHHH       7         TTTTTTTTTT        7        HT            
 *   8                           8                           8                      
 * 
 * Direction L Amount 25 
 *  R7C3    R7C5    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C4
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  HHHHHHHHH               -6   TTTTTTT                -6                      
 *  -5  H       H               -5  T       T               -5                      
 *  -4  H       H               -4  T       T               -4                      
 *  -3  HHHHHHHHHHHHHHHHHH      -3   TTTTTTTTTTTTTTTT       -3                      
 *  -2          H        H      -2          T        T      -2                      
 *  -1          H        H      -1          T        T      -1                      
 *   0          H        H       0          T        T       0                      
 *   1          H        H       1          T        T       1                      
 *   2     SHHHHH        H       2     TTTTT         T       2     S                
 *   3                   H       3                   T       3                      
 *   4                   H       4                   T       4                      
 *   5                   H       5                   T       5                      
 *   6                   H       6                   T       6                      
 *   7       HHHHHHHHHHHHH       7        TTTTTTTTTTT        7       HT             
 *   8                           8                           8                      
 * 
 * Direction L Amount 25 
 *  R7C2    R7C4    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C3
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  HHHHHHHHH               -6   TTTTTTT                -6                      
 *  -5  H       H               -5  T       T               -5                      
 *  -4  H       H               -4  T       T               -4                      
 *  -3  HHHHHHHHHHHHHHHHHH      -3   TTTTTTTTTTTTTTTT       -3                      
 *  -2          H        H      -2          T        T      -2                      
 *  -1          H        H      -1          T        T      -1                      
 *   0          H        H       0          T        T       0                      
 *   1          H        H       1          T        T       1                      
 *   2     SHHHHH        H       2     TTTTT         T       2     S                
 *   3                   H       3                   T       3                      
 *   4                   H       4                   T       4                      
 *   5                   H       5                   T       5                      
 *   6                   H       6                   T       6                      
 *   7      HHHHHHHHHHHHHH       7       TTTTTTTTTTTT        7      HT              
 *   8                           8                           8                      
 * 
 * Direction L Amount 25 
 *  R7C1    R7C3    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C2
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  HHHHHHHHH               -6   TTTTTTT                -6                      
 *  -5  H       H               -5  T       T               -5                      
 *  -4  H       H               -4  T       T               -4                      
 *  -3  HHHHHHHHHHHHHHHHHH      -3   TTTTTTTTTTTTTTTT       -3                      
 *  -2          H        H      -2          T        T      -2                      
 *  -1          H        H      -1          T        T      -1                      
 *   0          H        H       0          T        T       0                      
 *   1          H        H       1          T        T       1                      
 *   2     SHHHHH        H       2     TTTTT         T       2     S                
 *   3                   H       3                   T       3                      
 *   4                   H       4                   T       4                      
 *   5                   H       5                   T       5                      
 *   6                   H       6                   T       6                      
 *   7     HHHHHHHHHHHHHHH       7      TTTTTTTTTTTTT        7     HT               
 *   8                           8                           8                      
 * 
 * Direction L Amount 25 
 *  R7C0    R7C2    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C1
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  HHHHHHHHH               -6   TTTTTTT                -6                      
 *  -5  H       H               -5  T       T               -5                      
 *  -4  H       H               -4  T       T               -4                      
 *  -3  HHHHHHHHHHHHHHHHHH      -3   TTTTTTTTTTTTTTTT       -3                      
 *  -2          H        H      -2          T        T      -2                      
 *  -1          H        H      -1          T        T      -1                      
 *   0          H        H       0          T        T       0                      
 *   1          H        H       1          T        T       1                      
 *   2     SHHHHH        H       2     TTTTT         T       2     S                
 *   3                   H       3                   T       3                      
 *   4                   H       4                   T       4                      
 *   5                   H       5                   T       5                      
 *   6                   H       6                   T       6                      
 *   7    HHHHHHHHHHHHHHHH       7     TTTTTTTTTTTTTT        7    HT                
 *   8                           8                           8                      
 * 
 * Direction L Amount 25 
 *  R7C-1   R7C1    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C0
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  HHHHHHHHH               -6   TTTTTTT                -6                      
 *  -5  H       H               -5  T       T               -5                      
 *  -4  H       H               -4  T       T               -4                      
 *  -3  HHHHHHHHHHHHHHHHHH      -3   TTTTTTTTTTTTTTTT       -3                      
 *  -2          H        H      -2          T        T      -2                      
 *  -1          H        H      -1          T        T      -1                      
 *   0          H        H       0          T        T       0                      
 *   1          H        H       1          T        T       1                      
 *   2     SHHHHH        H       2     TTTTT         T       2     S                
 *   3                   H       3                   T       3                      
 *   4                   H       4                   T       4                      
 *   5                   H       5                   T       5                      
 *   6                   H       6                   T       6                      
 *   7   HHHHHHHHHHHHHHHHH       7    TTTTTTTTTTTTTTT        7   HT                 
 *   8                           8                           8                      
 * 
 * Direction L Amount 25 
 *  R7C-2   R7C0    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-1
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  HHHHHHHHH               -6   TTTTTTT                -6                      
 *  -5  H       H               -5  T       T               -5                      
 *  -4  H       H               -4  T       T               -4                      
 *  -3  HHHHHHHHHHHHHHHHHH      -3   TTTTTTTTTTTTTTTT       -3                      
 *  -2          H        H      -2          T        T      -2                      
 *  -1          H        H      -1          T        T      -1                      
 *   0          H        H       0          T        T       0                      
 *   1          H        H       1          T        T       1                      
 *   2     SHHHHH        H       2     TTTTT         T       2     S                
 *   3                   H       3                   T       3                      
 *   4                   H       4                   T       4                      
 *   5                   H       5                   T       5                      
 *   6                   H       6                   T       6                      
 *   7  HHHHHHHHHHHHHHHHHH       7   TTTTTTTTTTTTTTTT        7  HT                  
 *   8                           8                           8                      
 * 
 * Direction L Amount 25 
 *  R7C-3   R7C-1   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-2
 * 
 *      65432101234567890123456        65432101234567890123456        65432101234567890123456
 *  -6     HHHHHHHHH               -6      TTTTTTT                -6                         
 *  -5     H       H               -5     T       T               -5                         
 *  -4     H       H               -4     T       T               -4                         
 *  -3     HHHHHHHHHHHHHHHHHH      -3      TTTTTTTTTTTTTTTT       -3                         
 *  -2             H        H      -2             T        T      -2                         
 *  -1             H        H      -1             T        T      -1                         
 *   0             H        H       0             T        T       0                         
 *   1             H        H       1             T        T       1                         
 *   2        SHHHHH        H       2        TTTTT         T       2        S                
 *   3                      H       3                      T       3                         
 *   4                      H       4                      T       4                         
 *   5                      H       5                      T       5                         
 *   6                      H       6                      T       6                         
 *   7    HHHHHHHHHHHHHHHHHHH       7     TTTTTTTTTTTTTTTTT        7    HT                   
 *   8                              8                              8                         
 * 
 * Direction L Amount 25 
 *  R7C-4   R7C-2   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-3
 * 
 *      65432101234567890123456        65432101234567890123456        65432101234567890123456
 *  -6     HHHHHHHHH               -6      TTTTTTT                -6                         
 *  -5     H       H               -5     T       T               -5                         
 *  -4     H       H               -4     T       T               -4                         
 *  -3     HHHHHHHHHHHHHHHHHH      -3      TTTTTTTTTTTTTTTT       -3                         
 *  -2             H        H      -2             T        T      -2                         
 *  -1             H        H      -1             T        T      -1                         
 *   0             H        H       0             T        T       0                         
 *   1             H        H       1             T        T       1                         
 *   2        SHHHHH        H       2        TTTTT         T       2        S                
 *   3                      H       3                      T       3                         
 *   4                      H       4                      T       4                         
 *   5                      H       5                      T       5                         
 *   6                      H       6                      T       6                         
 *   7   HHHHHHHHHHHHHHHHHHHH       7    TTTTTTTTTTTTTTTTTT        7   HT                    
 *   8                              8                              8                         
 * 
 * Direction L Amount 25 
 *  R7C-5   R7C-3   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-4
 * 
 *      65432101234567890123456        65432101234567890123456        65432101234567890123456
 *  -6     HHHHHHHHH               -6      TTTTTTT                -6                         
 *  -5     H       H               -5     T       T               -5                         
 *  -4     H       H               -4     T       T               -4                         
 *  -3     HHHHHHHHHHHHHHHHHH      -3      TTTTTTTTTTTTTTTT       -3                         
 *  -2             H        H      -2             T        T      -2                         
 *  -1             H        H      -1             T        T      -1                         
 *   0             H        H       0             T        T       0                         
 *   1             H        H       1             T        T       1                         
 *   2        SHHHHH        H       2        TTTTT         T       2        S                
 *   3                      H       3                      T       3                         
 *   4                      H       4                      T       4                         
 *   5                      H       5                      T       5                         
 *   6                      H       6                      T       6                         
 *   7  HHHHHHHHHHHHHHHHHHHHH       7   TTTTTTTTTTTTTTTTTTT        7  HT                     
 *   8                              8                              8                         
 * 
 * Direction L Amount 25 
 *  R7C-6   R7C-4   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-5
 * 
 *      98765432101234567890123456        98765432101234567890123456        98765432101234567890123456
 *  -6        HHHHHHHHH               -6         TTTTTTT                -6                            
 *  -5        H       H               -5        T       T               -5                            
 *  -4        H       H               -4        T       T               -4                            
 *  -3        HHHHHHHHHHHHHHHHHH      -3         TTTTTTTTTTTTTTTT       -3                            
 *  -2                H        H      -2                T        T      -2                            
 *  -1                H        H      -1                T        T      -1                            
 *   0                H        H       0                T        T       0                            
 *   1                H        H       1                T        T       1                            
 *   2           SHHHHH        H       2           TTTTT         T       2           S                
 *   3                         H       3                         T       3                            
 *   4                         H       4                         T       4                            
 *   5                         H       5                         T       5                            
 *   6                         H       6                         T       6                            
 *   7    HHHHHHHHHHHHHHHHHHHHHH       7     TTTTTTTTTTTTTTTTTTTT        7    HT                      
 *   8                                 8                                 8                            
 * 
 * Direction L Amount 25 
 *  R7C-7   R7C-5   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-6
 * 
 *      98765432101234567890123456        98765432101234567890123456        98765432101234567890123456
 *  -6        HHHHHHHHH               -6         TTTTTTT                -6                            
 *  -5        H       H               -5        T       T               -5                            
 *  -4        H       H               -4        T       T               -4                            
 *  -3        HHHHHHHHHHHHHHHHHH      -3         TTTTTTTTTTTTTTTT       -3                            
 *  -2                H        H      -2                T        T      -2                            
 *  -1                H        H      -1                T        T      -1                            
 *   0                H        H       0                T        T       0                            
 *   1                H        H       1                T        T       1                            
 *   2           SHHHHH        H       2           TTTTT         T       2           S                
 *   3                         H       3                         T       3                            
 *   4                         H       4                         T       4                            
 *   5                         H       5                         T       5                            
 *   6                         H       6                         T       6                            
 *   7   HHHHHHHHHHHHHHHHHHHHHHH       7    TTTTTTTTTTTTTTTTTTTTT        7   HT                       
 *   8                                 8                                 8                            
 * 
 * Direction L Amount 25 
 *  R7C-8   R7C-6   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-7
 * 
 *      98765432101234567890123456        98765432101234567890123456        98765432101234567890123456
 *  -6        HHHHHHHHH               -6         TTTTTTT                -6                            
 *  -5        H       H               -5        T       T               -5                            
 *  -4        H       H               -4        T       T               -4                            
 *  -3        HHHHHHHHHHHHHHHHHH      -3         TTTTTTTTTTTTTTTT       -3                            
 *  -2                H        H      -2                T        T      -2                            
 *  -1                H        H      -1                T        T      -1                            
 *   0                H        H       0                T        T       0                            
 *   1                H        H       1                T        T       1                            
 *   2           SHHHHH        H       2           TTTTT         T       2           S                
 *   3                         H       3                         T       3                            
 *   4                         H       4                         T       4                            
 *   5                         H       5                         T       5                            
 *   6                         H       6                         T       6                            
 *   7  HHHHHHHHHHHHHHHHHHHHHHHH       7   TTTTTTTTTTTTTTTTTTTTTT        7  HT                        
 *   8                                 8                                 8                            
 * 
 * Direction L Amount 25 
 *  R7C-9   R7C-7   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-8
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 *  -6           HHHHHHHHH               -6            TTTTTTT                -6                               
 *  -5           H       H               -5           T       T               -5                               
 *  -4           H       H               -4           T       T               -4                               
 *  -3           HHHHHHHHHHHHHHHHHH      -3            TTTTTTTTTTTTTTTT       -3                               
 *  -2                   H        H      -2                   T        T      -2                               
 *  -1                   H        H      -1                   T        T      -1                               
 *   0                   H        H       0                   T        T       0                               
 *   1                   H        H       1                   T        T       1                               
 *   2              SHHHHH        H       2              TTTTT         T       2              S                
 *   3                            H       3                            T       3                               
 *   4                            H       4                            T       4                               
 *   5                            H       5                            T       5                               
 *   6                            H       6                            T       6                               
 *   7    HHHHHHHHHHHHHHHHHHHHHHHHH       7     TTTTTTTTTTTTTTTTTTTTTTT        7    HT                         
 *   8                                    8                                    8                               
 * 
 * Direction L Amount 25 
 *  R7C-10  R7C-8   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-9
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 *  -6           HHHHHHHHH               -6            TTTTTTT                -6                               
 *  -5           H       H               -5           T       T               -5                               
 *  -4           H       H               -4           T       T               -4                               
 *  -3           HHHHHHHHHHHHHHHHHH      -3            TTTTTTTTTTTTTTTT       -3                               
 *  -2                   H        H      -2                   T        T      -2                               
 *  -1                   H        H      -1                   T        T      -1                               
 *   0                   H        H       0                   T        T       0                               
 *   1                   H        H       1                   T        T       1                               
 *   2              SHHHHH        H       2              TTTTT         T       2              S                
 *   3                            H       3                            T       3                               
 *   4                            H       4                            T       4                               
 *   5                            H       5                            T       5                               
 *   6                            H       6                            T       6                               
 *   7   HHHHHHHHHHHHHHHHHHHHHHHHHH       7    TTTTTTTTTTTTTTTTTTTTTTTT        7   HT                          
 *   8                                    8                                    8                               
 * 
 * Direction L Amount 25 
 *  R7C-11  R7C-9   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-10
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 *  -6           HHHHHHHHH               -6            TTTTTTT                -6                               
 *  -5           H       H               -5           T       T               -5                               
 *  -4           H       H               -4           T       T               -4                               
 *  -3           HHHHHHHHHHHHHHHHHH      -3            TTTTTTTTTTTTTTTT       -3                               
 *  -2                   H        H      -2                   T        T      -2                               
 *  -1                   H        H      -1                   T        T      -1                               
 *   0                   H        H       0                   T        T       0                               
 *   1                   H        H       1                   T        T       1                               
 *   2              SHHHHH        H       2              TTTTT         T       2              S                
 *   3                            H       3                            T       3                               
 *   4                            H       4                            T       4                               
 *   5                            H       5                            T       5                               
 *   6   H                        H       6                            T       6   H                           
 *   7   HHHHHHHHHHHHHHHHHHHHHHHHHH       7    TTTTTTTTTTTTTTTTTTTTTTTT        7    T                          
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R6C-11  R7C-10  diff R -1  -1  C -1  -1  Move  R  0 C  0 To R7C-10
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 *  -6           HHHHHHHHH               -6            TTTTTTT                -6                               
 *  -5           H       H               -5           T       T               -5                               
 *  -4           H       H               -4           T       T               -4                               
 *  -3           HHHHHHHHHHHHHHHHHH      -3            TTTTTTTTTTTTTTTT       -3                               
 *  -2                   H        H      -2                   T        T      -2                               
 *  -1                   H        H      -1                   T        T      -1                               
 *   0                   H        H       0                   T        T       0                               
 *   1                   H        H       1                   T        T       1                               
 *   2              SHHHHH        H       2              TTTTT         T       2              S                
 *   3                            H       3                            T       3                               
 *   4                            H       4                            T       4                               
 *   5   H                        H       5                            T       5   H                           
 *   6   H                        H       6   T                        T       6   T                           
 *   7   HHHHHHHHHHHHHHHHHHHHHHHHHH       7    TTTTTTTTTTTTTTTTTTTTTTTT        7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R5C-11  R7C-10  diff R -2  -1  C -1  -1  Move  R -1 C -1 To R6C-11
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 *  -6           HHHHHHHHH               -6            TTTTTTT                -6                               
 *  -5           H       H               -5           T       T               -5                               
 *  -4           H       H               -4           T       T               -4                               
 *  -3           HHHHHHHHHHHHHHHHHH      -3            TTTTTTTTTTTTTTTT       -3                               
 *  -2                   H        H      -2                   T        T      -2                               
 *  -1                   H        H      -1                   T        T      -1                               
 *   0                   H        H       0                   T        T       0                               
 *   1                   H        H       1                   T        T       1                               
 *   2              SHHHHH        H       2              TTTTT         T       2              S                
 *   3                            H       3                            T       3                               
 *   4   H                        H       4                            T       4   H                           
 *   5   H                        H       5   T                        T       5   T                           
 *   6   H                        H       6   T                        T       6                               
 *   7   HHHHHHHHHHHHHHHHHHHHHHHHHH       7    TTTTTTTTTTTTTTTTTTTTTTTT        7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R4C-11  R6C-11  diff R -2  -1  C  0   0  Move  R -1 C  0 To R5C-11
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 *  -6           HHHHHHHHH               -6            TTTTTTT                -6                               
 *  -5           H       H               -5           T       T               -5                               
 *  -4           H       H               -4           T       T               -4                               
 *  -3           HHHHHHHHHHHHHHHHHH      -3            TTTTTTTTTTTTTTTT       -3                               
 *  -2                   H        H      -2                   T        T      -2                               
 *  -1                   H        H      -1                   T        T      -1                               
 *   0                   H        H       0                   T        T       0                               
 *   1                   H        H       1                   T        T       1                               
 *   2              SHHHHH        H       2              TTTTT         T       2              S                
 *   3   H                        H       3                            T       3   H                           
 *   4   H                        H       4   T                        T       4   T                           
 *   5   H                        H       5   T                        T       5                               
 *   6   H                        H       6   T                        T       6                               
 *   7   HHHHHHHHHHHHHHHHHHHHHHHHHH       7    TTTTTTTTTTTTTTTTTTTTTTTT        7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R3C-11  R5C-11  diff R -2  -1  C  0   0  Move  R -1 C  0 To R4C-11
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 *  -6           HHHHHHHHH               -6            TTTTTTT                -6                               
 *  -5           H       H               -5           T       T               -5                               
 *  -4           H       H               -4           T       T               -4                               
 *  -3           HHHHHHHHHHHHHHHHHH      -3            TTTTTTTTTTTTTTTT       -3                               
 *  -2                   H        H      -2                   T        T      -2                               
 *  -1                   H        H      -1                   T        T      -1                               
 *   0                   H        H       0                   T        T       0                               
 *   1                   H        H       1                   T        T       1                               
 *   2   H          SHHHHH        H       2              TTTTT         T       2   H          S                
 *   3   H                        H       3   T                        T       3   T                           
 *   4   H                        H       4   T                        T       4                               
 *   5   H                        H       5   T                        T       5                               
 *   6   H                        H       6   T                        T       6                               
 *   7   HHHHHHHHHHHHHHHHHHHHHHHHHH       7    TTTTTTTTTTTTTTTTTTTTTTTT        7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R2C-11  R4C-11  diff R -2  -1  C  0   0  Move  R -1 C  0 To R3C-11
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 *  -6           HHHHHHHHH               -6            TTTTTTT                -6                               
 *  -5           H       H               -5           T       T               -5                               
 *  -4           H       H               -4           T       T               -4                               
 *  -3           HHHHHHHHHHHHHHHHHH      -3            TTTTTTTTTTTTTTTT       -3                               
 *  -2                   H        H      -2                   T        T      -2                               
 *  -1                   H        H      -1                   T        T      -1                               
 *   0                   H        H       0                   T        T       0                               
 *   1   H               H        H       1                   T        T       1   H                           
 *   2   H          SHHHHH        H       2   T          TTTTT         T       2   T          S                
 *   3   H                        H       3   T                        T       3                               
 *   4   H                        H       4   T                        T       4                               
 *   5   H                        H       5   T                        T       5                               
 *   6   H                        H       6   T                        T       6                               
 *   7   HHHHHHHHHHHHHHHHHHHHHHHHHH       7    TTTTTTTTTTTTTTTTTTTTTTTT        7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R1C-11  R3C-11  diff R -2  -1  C  0   0  Move  R -1 C  0 To R2C-11
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 *  -6           HHHHHHHHH               -6            TTTTTTT                -6                               
 *  -5           H       H               -5           T       T               -5                               
 *  -4           H       H               -4           T       T               -4                               
 *  -3           HHHHHHHHHHHHHHHHHH      -3            TTTTTTTTTTTTTTTT       -3                               
 *  -2                   H        H      -2                   T        T      -2                               
 *  -1                   H        H      -1                   T        T      -1                               
 *   0   H               H        H       0                   T        T       0   H                           
 *   1   H               H        H       1   T               T        T       1   T                           
 *   2   H          SHHHHH        H       2   T          TTTTT         T       2              S                
 *   3   H                        H       3   T                        T       3                               
 *   4   H                        H       4   T                        T       4                               
 *   5   H                        H       5   T                        T       5                               
 *   6   H                        H       6   T                        T       6                               
 *   7   HHHHHHHHHHHHHHHHHHHHHHHHHH       7    TTTTTTTTTTTTTTTTTTTTTTTT        7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R0C-11  R2C-11  diff R -2  -1  C  0   0  Move  R -1 C  0 To R1C-11
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 *  -6           HHHHHHHHH               -6            TTTTTTT                -6                               
 *  -5           H       H               -5           T       T               -5                               
 *  -4           H       H               -4           T       T               -4                               
 *  -3           HHHHHHHHHHHHHHHHHH      -3            TTTTTTTTTTTTTTTT       -3                               
 *  -2                   H        H      -2                   T        T      -2                               
 *  -1   H               H        H      -1                   T        T      -1   H                           
 *   0   H               H        H       0   T               T        T       0   T                           
 *   1   H               H        H       1   T               T        T       1                               
 *   2   H          SHHHHH        H       2   T          TTTTT         T       2              S                
 *   3   H                        H       3   T                        T       3                               
 *   4   H                        H       4   T                        T       4                               
 *   5   H                        H       5   T                        T       5                               
 *   6   H                        H       6   T                        T       6                               
 *   7   HHHHHHHHHHHHHHHHHHHHHHHHHH       7    TTTTTTTTTTTTTTTTTTTTTTTT        7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R-1C-11 R1C-11  diff R -2  -1  C  0   0  Move  R -1 C  0 To R0C-11
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 *  -6           HHHHHHHHH               -6            TTTTTTT                -6                               
 *  -5           H       H               -5           T       T               -5                               
 *  -4           H       H               -4           T       T               -4                               
 *  -3           HHHHHHHHHHHHHHHHHH      -3            TTTTTTTTTTTTTTTT       -3                               
 *  -2   H               H        H      -2                   T        T      -2   H                           
 *  -1   H               H        H      -1   T               T        T      -1   T                           
 *   0   H               H        H       0   T               T        T       0                               
 *   1   H               H        H       1   T               T        T       1                               
 *   2   H          SHHHHH        H       2   T          TTTTT         T       2              S                
 *   3   H                        H       3   T                        T       3                               
 *   4   H                        H       4   T                        T       4                               
 *   5   H                        H       5   T                        T       5                               
 *   6   H                        H       6   T                        T       6                               
 *   7   HHHHHHHHHHHHHHHHHHHHHHHHHH       7    TTTTTTTTTTTTTTTTTTTTTTTT        7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R-2C-11 R0C-11  diff R -2  -1  C  0   0  Move  R -1 C  0 To R-1C-11
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 *  -6           HHHHHHHHH               -6            TTTTTTT                -6                               
 *  -5           H       H               -5           T       T               -5                               
 *  -4           H       H               -4           T       T               -4                               
 *  -3   H       HHHHHHHHHHHHHHHHHH      -3            TTTTTTTTTTTTTTTT       -3   H                           
 *  -2   H               H        H      -2   T               T        T      -2   T                           
 *  -1   H               H        H      -1   T               T        T      -1                               
 *   0   H               H        H       0   T               T        T       0                               
 *   1   H               H        H       1   T               T        T       1                               
 *   2   H          SHHHHH        H       2   T          TTTTT         T       2              S                
 *   3   H                        H       3   T                        T       3                               
 *   4   H                        H       4   T                        T       4                               
 *   5   H                        H       5   T                        T       5                               
 *   6   H                        H       6   T                        T       6                               
 *   7   HHHHHHHHHHHHHHHHHHHHHHHHHH       7    TTTTTTTTTTTTTTTTTTTTTTTT        7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R-3C-11 R-1C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-2C-11
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 *  -6           HHHHHHHHH               -6            TTTTTTT                -6                               
 *  -5           H       H               -5           T       T               -5                               
 *  -4   H       H       H               -4           T       T               -4   H                           
 *  -3   H       HHHHHHHHHHHHHHHHHH      -3   T        TTTTTTTTTTTTTTTT       -3   T                           
 *  -2   H               H        H      -2   T               T        T      -2                               
 *  -1   H               H        H      -1   T               T        T      -1                               
 *   0   H               H        H       0   T               T        T       0                               
 *   1   H               H        H       1   T               T        T       1                               
 *   2   H          SHHHHH        H       2   T          TTTTT         T       2              S                
 *   3   H                        H       3   T                        T       3                               
 *   4   H                        H       4   T                        T       4                               
 *   5   H                        H       5   T                        T       5                               
 *   6   H                        H       6   T                        T       6                               
 *   7   HHHHHHHHHHHHHHHHHHHHHHHHHH       7    TTTTTTTTTTTTTTTTTTTTTTTT        7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R-4C-11 R-2C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-3C-11
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 *  -6           HHHHHHHHH               -6            TTTTTTT                -6                               
 *  -5   H       H       H               -5           T       T               -5   H                           
 *  -4   H       H       H               -4   T       T       T               -4   T                           
 *  -3   H       HHHHHHHHHHHHHHHHHH      -3   T        TTTTTTTTTTTTTTTT       -3                               
 *  -2   H               H        H      -2   T               T        T      -2                               
 *  -1   H               H        H      -1   T               T        T      -1                               
 *   0   H               H        H       0   T               T        T       0                               
 *   1   H               H        H       1   T               T        T       1                               
 *   2   H          SHHHHH        H       2   T          TTTTT         T       2              S                
 *   3   H                        H       3   T                        T       3                               
 *   4   H                        H       4   T                        T       4                               
 *   5   H                        H       5   T                        T       5                               
 *   6   H                        H       6   T                        T       6                               
 *   7   HHHHHHHHHHHHHHHHHHHHHHHHHH       7    TTTTTTTTTTTTTTTTTTTTTTTT        7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R-5C-11 R-3C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-4C-11
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 *  -6   H       HHHHHHHHH               -6            TTTTTTT                -6   H                           
 *  -5   H       H       H               -5   T       T       T               -5   T                           
 *  -4   H       H       H               -4   T       T       T               -4                               
 *  -3   H       HHHHHHHHHHHHHHHHHH      -3   T        TTTTTTTTTTTTTTTT       -3                               
 *  -2   H               H        H      -2   T               T        T      -2                               
 *  -1   H               H        H      -1   T               T        T      -1                               
 *   0   H               H        H       0   T               T        T       0                               
 *   1   H               H        H       1   T               T        T       1                               
 *   2   H          SHHHHH        H       2   T          TTTTT         T       2              S                
 *   3   H                        H       3   T                        T       3                               
 *   4   H                        H       4   T                        T       4                               
 *   5   H                        H       5   T                        T       5                               
 *   6   H                        H       6   T                        T       6                               
 *   7   HHHHHHHHHHHHHHHHHHHHHHHHHH       7    TTTTTTTTTTTTTTTTTTTTTTTT        7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R-6C-11 R-4C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-5C-11
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 *  -9                                   -9                                   -9                               
 *  -8                                   -8                                   -8                               
 *  -7   H                               -7                                   -7   H                           
 *  -6   H       HHHHHHHHH               -6   T        TTTTTTT                -6   T                           
 *  -5   H       H       H               -5   T       T       T               -5                               
 *  -4   H       H       H               -4   T       T       T               -4                               
 *  -3   H       HHHHHHHHHHHHHHHHHH      -3   T        TTTTTTTTTTTTTTTT       -3                               
 *  -2   H               H        H      -2   T               T        T      -2                               
 *  -1   H               H        H      -1   T               T        T      -1                               
 *   0   H               H        H       0   T               T        T       0                               
 *   1   H               H        H       1   T               T        T       1                               
 *   2   H          SHHHHH        H       2   T          TTTTT         T       2              S                
 *   3   H                        H       3   T                        T       3                               
 *   4   H                        H       4   T                        T       4                               
 *   5   H                        H       5   T                        T       5                               
 *   6   H                        H       6   T                        T       6                               
 *   7   HHHHHHHHHHHHHHHHHHHHHHHHHH       7    TTTTTTTTTTTTTTTTTTTTTTTT        7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R-7C-11 R-5C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-6C-11
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 *  -9                                   -9                                   -9                               
 *  -8   H                               -8                                   -8   H                           
 *  -7   H                               -7   T                               -7   T                           
 *  -6   H       HHHHHHHHH               -6   T        TTTTTTT                -6                               
 *  -5   H       H       H               -5   T       T       T               -5                               
 *  -4   H       H       H               -4   T       T       T               -4                               
 *  -3   H       HHHHHHHHHHHHHHHHHH      -3   T        TTTTTTTTTTTTTTTT       -3                               
 *  -2   H               H        H      -2   T               T        T      -2                               
 *  -1   H               H        H      -1   T               T        T      -1                               
 *   0   H               H        H       0   T               T        T       0                               
 *   1   H               H        H       1   T               T        T       1                               
 *   2   H          SHHHHH        H       2   T          TTTTT         T       2              S                
 *   3   H                        H       3   T                        T       3                               
 *   4   H                        H       4   T                        T       4                               
 *   5   H                        H       5   T                        T       5                               
 *   6   H                        H       6   T                        T       6                               
 *   7   HHHHHHHHHHHHHHHHHHHHHHHHHH       7    TTTTTTTTTTTTTTTTTTTTTTTT        7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R-8C-11 R-6C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-7C-11
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 *  -9   H                               -9                                   -9   H                           
 *  -8   H                               -8   T                               -8   T                           
 *  -7   H                               -7   T                               -7                               
 *  -6   H       HHHHHHHHH               -6   T        TTTTTTT                -6                               
 *  -5   H       H       H               -5   T       T       T               -5                               
 *  -4   H       H       H               -4   T       T       T               -4                               
 *  -3   H       HHHHHHHHHHHHHHHHHH      -3   T        TTTTTTTTTTTTTTTT       -3                               
 *  -2   H               H        H      -2   T               T        T      -2                               
 *  -1   H               H        H      -1   T               T        T      -1                               
 *   0   H               H        H       0   T               T        T       0                               
 *   1   H               H        H       1   T               T        T       1                               
 *   2   H          SHHHHH        H       2   T          TTTTT         T       2              S                
 *   3   H                        H       3   T                        T       3                               
 *   4   H                        H       4   T                        T       4                               
 *   5   H                        H       5   T                        T       5                               
 *   6   H                        H       6   T                        T       6                               
 *   7   HHHHHHHHHHHHHHHHHHHHHHHHHH       7    TTTTTTTTTTTTTTTTTTTTTTTT        7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R-9C-11 R-7C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-8C-11
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 * -12                                  -12                                  -12                               
 * -11                                  -11                                  -11                               
 * -10   H                              -10                                  -10   H                           
 *  -9   H                               -9   T                               -9   T                           
 *  -8   H                               -8   T                               -8                               
 *  -7   H                               -7   T                               -7                               
 *  -6   H       HHHHHHHHH               -6   T        TTTTTTT                -6                               
 *  -5   H       H       H               -5   T       T       T               -5                               
 *  -4   H       H       H               -4   T       T       T               -4                               
 *  -3   H       HHHHHHHHHHHHHHHHHH      -3   T        TTTTTTTTTTTTTTTT       -3                               
 *  -2   H               H        H      -2   T               T        T      -2                               
 *  -1   H               H        H      -1   T               T        T      -1                               
 *   0   H               H        H       0   T               T        T       0                               
 *   1   H               H        H       1   T               T        T       1                               
 *   2   H          SHHHHH        H       2   T          TTTTT         T       2              S                
 *   3   H                        H       3   T                        T       3                               
 *   4   H                        H       4   T                        T       4                               
 *   5   H                        H       5   T                        T       5                               
 *   6   H                        H       6   T                        T       6                               
 *   7   HHHHHHHHHHHHHHHHHHHHHHHHHH       7    TTTTTTTTTTTTTTTTTTTTTTTT        7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R-10C-11 R-8C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-9C-11
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 * -12                                  -12                                  -12                               
 * -11   H                              -11                                  -11   H                           
 * -10   H                              -10   T                              -10   T                           
 *  -9   H                               -9   T                               -9                               
 *  -8   H                               -8   T                               -8                               
 *  -7   H                               -7   T                               -7                               
 *  -6   H       HHHHHHHHH               -6   T        TTTTTTT                -6                               
 *  -5   H       H       H               -5   T       T       T               -5                               
 *  -4   H       H       H               -4   T       T       T               -4                               
 *  -3   H       HHHHHHHHHHHHHHHHHH      -3   T        TTTTTTTTTTTTTTTT       -3                               
 *  -2   H               H        H      -2   T               T        T      -2                               
 *  -1   H               H        H      -1   T               T        T      -1                               
 *   0   H               H        H       0   T               T        T       0                               
 *   1   H               H        H       1   T               T        T       1                               
 *   2   H          SHHHHH        H       2   T          TTTTT         T       2              S                
 *   3   H                        H       3   T                        T       3                               
 *   4   H                        H       4   T                        T       4                               
 *   5   H                        H       5   T                        T       5                               
 *   6   H                        H       6   T                        T       6                               
 *   7   HHHHHHHHHHHHHHHHHHHHHHHHHH       7    TTTTTTTTTTTTTTTTTTTTTTTT        7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R-11C-11 R-9C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-10C-11
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 * -12   H                              -12                                  -12   H                           
 * -11   H                              -11   T                              -11   T                           
 * -10   H                              -10   T                              -10                               
 *  -9   H                               -9   T                               -9                               
 *  -8   H                               -8   T                               -8                               
 *  -7   H                               -7   T                               -7                               
 *  -6   H       HHHHHHHHH               -6   T        TTTTTTT                -6                               
 *  -5   H       H       H               -5   T       T       T               -5                               
 *  -4   H       H       H               -4   T       T       T               -4                               
 *  -3   H       HHHHHHHHHHHHHHHHHH      -3   T        TTTTTTTTTTTTTTTT       -3                               
 *  -2   H               H        H      -2   T               T        T      -2                               
 *  -1   H               H        H      -1   T               T        T      -1                               
 *   0   H               H        H       0   T               T        T       0                               
 *   1   H               H        H       1   T               T        T       1                               
 *   2   H          SHHHHH        H       2   T          TTTTT         T       2              S                
 *   3   H                        H       3   T                        T       3                               
 *   4   H                        H       4   T                        T       4                               
 *   5   H                        H       5   T                        T       5                               
 *   6   H                        H       6   T                        T       6                               
 *   7   HHHHHHHHHHHHHHHHHHHHHHHHHH       7    TTTTTTTTTTTTTTTTTTTTTTTT        7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R-12C-11 R-10C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-11C-11
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 * -15                                  -15                                  -15                               
 * -14                                  -14                                  -14                               
 * -13   H                              -13                                  -13   H                           
 * -12   H                              -12   T                              -12   T                           
 * -11   H                              -11   T                              -11                               
 * -10   H                              -10   T                              -10                               
 *  -9   H                               -9   T                               -9                               
 *  -8   H                               -8   T                               -8                               
 *  -7   H                               -7   T                               -7                               
 *  -6   H       HHHHHHHHH               -6   T        TTTTTTT                -6                               
 *  -5   H       H       H               -5   T       T       T               -5                               
 *  -4   H       H       H               -4   T       T       T               -4                               
 *  -3   H       HHHHHHHHHHHHHHHHHH      -3   T        TTTTTTTTTTTTTTTT       -3                               
 *  -2   H               H        H      -2   T               T        T      -2                               
 *  -1   H               H        H      -1   T               T        T      -1                               
 *   0   H               H        H       0   T               T        T       0                               
 *   1   H               H        H       1   T               T        T       1                               
 *   2   H          SHHHHH        H       2   T          TTTTT         T       2              S                
 *   3   H                        H       3   T                        T       3                               
 *   4   H                        H       4   T                        T       4                               
 *   5   H                        H       5   T                        T       5                               
 *   6   H                        H       6   T                        T       6                               
 *   7   HHHHHHHHHHHHHHHHHHHHHHHHHH       7    TTTTTTTTTTTTTTTTTTTTTTTT        7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R-13C-11 R-11C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-12C-11
 * 
 * 
 *      0        0        0
 *   0        0        0   
 *   1        1        1   
 *   2  S     2  T     2  S
 *   3        3        3   
 *   4        4        4   
 * 
 * Direction R Amount 5 
 *  R2C1    R2C0    diff R  0   0  C  1   1  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 * 
 *      01234        01234        01234
 *   0            0            0       
 *   1            1            1       
 *   2  S1H       2  T         2  S1H  
 *   3            3            3       
 *   4            4            4       
 * 
 * Direction R Amount 5 
 *  R2C2    R2C0    diff R  0   0  C  2   1  Move  R  0 C  1 To R2C1
 *  R2C1    R2C0    diff R  0   0  C  1   1  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 * 
 *      01234        01234        01234
 *   0            0            0       
 *   1            1            1       
 *   2  S21H      2  T         2  S21H 
 *   3            3            3       
 *   4            4            4       
 * 
 * Direction R Amount 5 
 *  R2C3    R2C1    diff R  0   0  C  2   1  Move  R  0 C  1 To R2C2
 *  R2C2    R2C0    diff R  0   0  C  2   1  Move  R  0 C  1 To R2C1
 *  R2C1    R2C0    diff R  0   0  C  1   1  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 * 
 *      01234        01234        01234
 *   0            0            0       
 *   1            1            1       
 *   2  S321H     2  T         2  S321H
 *   3            3            3       
 *   4            4            4       
 * 
 * Direction R Amount 5 
 *  R2C4    R2C2    diff R  0   0  C  2   1  Move  R  0 C  1 To R2C3
 *  R2C3    R2C1    diff R  0   0  C  2   1  Move  R  0 C  1 To R2C2
 *  R2C2    R2C0    diff R  0   0  C  2   1  Move  R  0 C  1 To R2C1
 *  R2C1    R2C0    diff R  0   0  C  1   1  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 * 
 *      01234        01234        01234
 *   0            0            0       
 *   1            1            1       
 *   2  S4321     2  T         2  S4321
 *   3            3            3       
 *   4            4            4       
 * 
 * Direction R Amount 5 
 *  R2C5    R2C3    diff R  0   0  C  2   1  Move  R  0 C  1 To R2C4
 *  R2C4    R2C2    diff R  0   0  C  2   1  Move  R  0 C  1 To R2C3
 *  R2C3    R2C1    diff R  0   0  C  2   1  Move  R  0 C  1 To R2C2
 *  R2C2    R2C0    diff R  0   0  C  2   1  Move  R  0 C  1 To R2C1
 *  R2C1    R2C0    diff R  0   0  C  1   1  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 * 
 *      01234        01234        01234
 *   0            0            0       
 *   1            1            1       
 *   2  S4321     2  T         2  S4321
 *   3            3            3       
 *   4            4            4       
 * 
 * Direction U Amount 8 
 *  R1C5    R2C4    diff R -1  -1  C  1   1  Move  R  0 C  0 To R2C4
 *  R2C4    R2C3    diff R  0   0  C  1   1  Move  R  0 C  0 To R2C3
 *  R2C3    R2C2    diff R  0   0  C  1   1  Move  R  0 C  0 To R2C2
 *  R2C2    R2C1    diff R  0   0  C  1   1  Move  R  0 C  0 To R2C1
 *  R2C1    R2C0    diff R  0   0  C  1   1  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 * 
 *      01234        01234        01234
 *   0            0            0       
 *   1   5432     1            1   5432
 *   2  S4321     2  T         2  S    
 *   3            3            3       
 *   4            4            4       
 * 
 * Direction U Amount 8 
 *  R0C5    R2C4    diff R -2  -1  C  1   1  Move  R -1 C  1 To R1C5
 *  R1C5    R2C3    diff R -1  -1  C  2   1  Move  R -1 C  1 To R1C4
 *  R1C4    R2C2    diff R -1  -1  C  2   1  Move  R -1 C  1 To R1C3
 *  R1C3    R2C1    diff R -1  -1  C  2   1  Move  R -1 C  1 To R1C2
 *  R1C2    R2C0    diff R -1  -1  C  2   1  Move  R -1 C  1 To R1C1
 *  R1C1    R2C0    diff R -1  -1  C  1   1  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 * 
 *      01234        01234        01234
 *  -3           -3           -3       
 *  -2           -2           -2       
 *  -1           -1           -1       
 *   0            0            0       
 *   1   5432     1            1   5432
 *   2  S4321     2  T         2  S    
 *   3            3            3       
 *   4            4            4       
 * 
 * Direction U Amount 8 
 *  R-1C5   R1C5    diff R -2  -1  C  0   0  Move  R -1 C  0 To R0C5
 *  R0C5    R1C4    diff R -1  -1  C  1   1  Move  R  0 C  0 To R1C4
 *  R1C4    R1C3    diff R  0   0  C  1   1  Move  R  0 C  0 To R1C3
 *  R1C3    R1C2    diff R  0   0  C  1   1  Move  R  0 C  0 To R1C2
 *  R1C2    R1C1    diff R  0   0  C  1   1  Move  R  0 C  0 To R1C1
 *  R1C1    R2C0    diff R -1  -1  C  1   1  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 * 
 *      01234        01234        01234
 *  -3           -3           -3       
 *  -2           -2           -2       
 *  -1           -1           -1       
 *   0    543     0            0    543
 *   1   6432     1            1   6   
 *   2  S4321     2  T         2  S    
 *   3            3            3       
 *   4            4            4       
 * 
 * Direction U Amount 8 
 *  R-2C5   R0C5    diff R -2  -1  C  0   0  Move  R -1 C  0 To R-1C5
 *  R-1C5   R1C4    diff R -2  -1  C  1   1  Move  R -1 C  1 To R0C5
 *  R0C5    R1C3    diff R -1  -1  C  2   1  Move  R -1 C  1 To R0C4
 *  R0C4    R1C2    diff R -1  -1  C  2   1  Move  R -1 C  1 To R0C3
 *  R0C3    R1C1    diff R -1  -1  C  2   1  Move  R -1 C  1 To R0C2
 *  R0C2    R2C0    diff R -2  -1  C  2   1  Move  R -1 C  1 To R1C1
 *  R1C1    R2C0    diff R -1  -1  C  1   1  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 * 
 *      01234        01234        01234
 *  -3           -3           -3       
 *  -2           -2           -2       
 *  -1           -1           -1       
 *   0    543     0            0    543
 *   1   6432     1            1   6   
 *   2  S4321     2  T         2  S    
 *   3            3            3       
 *   4            4            4       
 * 
 * Direction U Amount 8 
 *  R-3C5   R-1C5   diff R -2  -1  C  0   0  Move  R -1 C  0 To R-2C5
 *  R-2C5   R0C5    diff R -2  -1  C  0   0  Move  R -1 C  0 To R-1C5
 *  R-1C5   R0C4    diff R -1  -1  C  1   1  Move  R  0 C  0 To R0C4
 *  R0C4    R0C3    diff R  0   0  C  1   1  Move  R  0 C  0 To R0C3
 *  R0C3    R0C2    diff R  0   0  C  1   1  Move  R  0 C  0 To R0C2
 *  R0C2    R1C1    diff R -1  -1  C  1   1  Move  R  0 C  0 To R1C1
 *  R1C1    R2C0    diff R -1  -1  C  1   1  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 * 
 *      01234        01234        01234
 *  -6           -6           -6       
 *  -5           -5           -5       
 *  -4           -4           -4       
 *  -3           -3           -3       
 *  -2           -2           -2       
 *  -1     54    -1           -1     54
 *   0    643     0            0    6  
 *   1   7432     1            1   7   
 *   2  S4321     2  T         2  S    
 *   3            3            3       
 *   4            4            4       
 * 
 * Direction U Amount 8 
 *  R-4C5   R-2C5   diff R -2  -1  C  0   0  Move  R -1 C  0 To R-3C5
 *  R-3C5   R-1C5   diff R -2  -1  C  0   0  Move  R -1 C  0 To R-2C5
 *  R-2C5   R0C4    diff R -2  -1  C  1   1  Move  R -1 C  1 To R-1C5
 *  R-1C5   R0C3    diff R -1  -1  C  2   1  Move  R -1 C  1 To R-1C4
 *  R-1C4   R0C2    diff R -1  -1  C  2   1  Move  R -1 C  1 To R-1C3
 *  R-1C3   R1C1    diff R -2  -1  C  2   1  Move  R -1 C  1 To R0C2
 *  R0C2    R2C0    diff R -2  -1  C  2   1  Move  R -1 C  1 To R1C1
 *  R1C1    R2C0    diff R -1  -1  C  1   1  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 * 
 *      01234        01234        01234
 *  -6           -6           -6       
 *  -5           -5           -5       
 *  -4           -4           -4       
 *  -3           -3           -3       
 *  -2           -2           -2       
 *  -1     54    -1           -1     54
 *   0    643     0            0    6  
 *   1   7432     1            1   7   
 *   2  S4321     2  T         2  S    
 *   3            3            3       
 *   4            4            4       
 * 
 * Direction U Amount 8 
 *  R-5C5   R-3C5   diff R -2  -1  C  0   0  Move  R -1 C  0 To R-4C5
 *  R-4C5   R-2C5   diff R -2  -1  C  0   0  Move  R -1 C  0 To R-3C5
 *  R-3C5   R-1C5   diff R -2  -1  C  0   0  Move  R -1 C  0 To R-2C5
 *  R-2C5   R-1C4   diff R -1  -1  C  1   1  Move  R  0 C  0 To R-1C4
 *  R-1C4   R-1C3   diff R  0   0  C  1   1  Move  R  0 C  0 To R-1C3
 *  R-1C3   R0C2    diff R -1  -1  C  1   1  Move  R  0 C  0 To R0C2
 *  R0C2    R1C1    diff R -1  -1  C  1   1  Move  R  0 C  0 To R1C1
 *  R1C1    R2C0    diff R -1  -1  C  1   1  Move  R  0 C  0 To R2C0
 *  R2C0    R2C0    diff R  0   0  C  0   0  Move  R  0 C  0 To R2C0
 * 
 *      01234        01234        01234
 *  -6           -6           -6       
 *  -5           -5           -5       
 *  -4           -4           -4       
 *  -3           -3           -3       
 *  -2      5    -2           -2      5
 *  -1     64    -1           -1     6 
 *   0    743     0            0    7  
 *   1   8432     1            1   8   
 *   2  S4321     2  T         2  S    
 *   3            3            3       
 *   4            4            4       
 * 
 * Direction U Amount 8 
 *  R-6C5   R-4C5   diff R -2  -1  C  0   0  Move  R -1 C  0 To R-5C5
 *  R-5C5   R-3C5   diff R -2  -1  C  0   0  Move  R -1 C  0 To R-4C5
 *  R-4C5   R-2C5   diff R -2  -1  C  0   0  Move  R -1 C  0 To R-3C5
 *  R-3C5   R-1C4   diff R -2  -1  C  1   1  Move  R -1 C  1 To R-2C5
 *  R-2C5   R-1C3   diff R -1  -1  C  2   1  Move  R -1 C  1 To R-2C4
 *  R-2C4   R0C2    diff R -2  -1  C  2   1  Move  R -1 C  1 To R-1C3
 *  R-1C3   R1C1    diff R -2  -1  C  2   1  Move  R -1 C  1 To R0C2
 *  R0C2    R2C0    diff R -2  -1  C  2   1  Move  R -1 C  1 To R1C1
 *  R1C1    R2C0    diff R -1  -1  C  1   1  Move  R  0 C  0 To R2C0
 * 
 *      01234        01234        01234
 *  -6      H    -6           -6      H
 *  -5           -5           -5       
 *  -4           -4           -4       
 *  -3           -3           -3       
 *  -2      5    -2           -2      5
 *  -1     64    -1           -1     6 
 *   0    743     0            0    7  
 *   1   8432     1            1   8   
 *   2  S4321     2  T         2  S    
 *   3            3            3       
 *   4            4            4       
 * 
 * Direction L Amount 8 
 *  R-6C4   R-5C5   diff R -1  -1  C -1  -1  Move  R  0 C  0 To R-5C5
 *  R-5C5   R-4C5   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-4C5
 *  R-4C5   R-3C5   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-3C5
 *  R-3C5   R-2C5   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-2C5
 *  R-2C5   R-2C4   diff R  0   0  C  1   1  Move  R  0 C  0 To R-2C4
 *  R-2C4   R-1C3   diff R -1  -1  C  1   1  Move  R  0 C  0 To R-1C3
 *  R-1C3   R0C2    diff R -1  -1  C  1   1  Move  R  0 C  0 To R0C2
 *  R0C2    R1C1    diff R -1  -1  C  1   1  Move  R  0 C  0 To R1C1
 *  R1C1    R2C0    diff R -1  -1  C  1   1  Move  R  0 C  0 To R2C0
 * 
 *      01234        01234        01234
 *  -6     H1    -6           -6     H1
 *  -5      2    -5           -5      2
 *  -4      3    -4           -4      3
 *  -3      4    -3           -3      4
 *  -2      5    -2           -2      5
 *  -1     64    -1           -1     6 
 *   0    743     0            0    7  
 *   1   8432     1            1   8   
 *   2  S4321     2  T         2  S    
 *   3            3            3       
 *   4            4            4       
 * 
 * Direction L Amount 8 
 *  R-6C3   R-5C5   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R-6C4
 *  R-6C4   R-4C5   diff R -2  -1  C -1  -1  Move  R -1 C -1 To R-5C4
 *  R-5C4   R-3C5   diff R -2  -1  C -1  -1  Move  R -1 C -1 To R-4C4
 *  R-4C4   R-2C5   diff R -2  -1  C -1  -1  Move  R -1 C -1 To R-3C4
 *  R-3C4   R-2C4   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-2C4
 *  R-2C4   R-1C3   diff R -1  -1  C  1   1  Move  R  0 C  0 To R-1C3
 *  R-1C3   R0C2    diff R -1  -1  C  1   1  Move  R  0 C  0 To R0C2
 *  R0C2    R1C1    diff R -1  -1  C  1   1  Move  R  0 C  0 To R1C1
 *  R1C1    R2C0    diff R -1  -1  C  1   1  Move  R  0 C  0 To R2C0
 * 
 *      01234        01234        01234
 *  -6    H11    -6           -6    H1 
 *  -5      2    -5           -5      2
 *  -4      3    -4           -4      3
 *  -3      4    -3           -3      4
 *  -2      5    -2           -2      5
 *  -1     64    -1           -1     6 
 *   0    743     0            0    7  
 *   1   8432     1            1   8   
 *   2  S4321     2  T         2  S    
 *   3            3            3       
 *   4            4            4       
 * 
 * Direction L Amount 8 
 *  R-6C2   R-6C4   diff R  0   0  C -2  -1  Move  R  0 C -1 To R-6C3
 *  R-6C3   R-5C4   diff R -1  -1  C -1  -1  Move  R  0 C  0 To R-5C4
 *  R-5C4   R-4C4   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-4C4
 *  R-4C4   R-3C4   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-3C4
 *  R-3C4   R-2C4   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-2C4
 *  R-2C4   R-1C3   diff R -1  -1  C  1   1  Move  R  0 C  0 To R-1C3
 *  R-1C3   R0C2    diff R -1  -1  C  1   1  Move  R  0 C  0 To R0C2
 *  R0C2    R1C1    diff R -1  -1  C  1   1  Move  R  0 C  0 To R1C1
 *  R1C1    R2C0    diff R -1  -1  C  1   1  Move  R  0 C  0 To R2C0
 * 
 *      01234        01234        01234
 *  -6   H121    -6           -6   H12 
 *  -5     32    -5           -5     3 
 *  -4     43    -4           -4     4 
 *  -3     54    -3           -3     5 
 *  -2     65    -2           -2     6 
 *  -1     74    -1           -1     7 
 *   0    843     0            0    8  
 *   1   8432     1   T        1   T   
 *   2  S4321     2  T         2  S    
 *   3            3            3       
 *   4            4            4       
 * 
 * Direction L Amount 8 
 *  R-6C1   R-6C3   diff R  0   0  C -2  -1  Move  R  0 C -1 To R-6C2
 *  R-6C2   R-5C4   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R-6C3
 *  R-6C3   R-4C4   diff R -2  -1  C -1  -1  Move  R -1 C -1 To R-5C3
 *  R-5C3   R-3C4   diff R -2  -1  C -1  -1  Move  R -1 C -1 To R-4C3
 *  R-4C3   R-2C4   diff R -2  -1  C -1  -1  Move  R -1 C -1 To R-3C3
 *  R-3C3   R-1C3   diff R -2  -1  C  0   0  Move  R -1 C  0 To R-2C3
 *  R-2C3   R0C2    diff R -2  -1  C  1   1  Move  R -1 C  1 To R-1C3
 *  R-1C3   R1C1    diff R -2  -1  C  2   1  Move  R -1 C  1 To R0C2
 *  R0C2    R2C0    diff R -2  -1  C  2   1  Move  R -1 C  1 To R1C1
 * 
 *      01234        01234        01234
 *  -6  H1221    -6           -6  H12  
 *  -5     32    -5           -5     3 
 *  -4     43    -4           -4     4 
 *  -3     54    -3           -3     5 
 *  -2     65    -2           -2     6 
 *  -1     74    -1           -1     7 
 *   0    843     0            0    8  
 *   1   8432     1   T        1   T   
 *   2  S4321     2  T         2  S    
 *   3            3            3       
 *   4            4            4       
 * 
 * Direction L Amount 8 
 *  R-6C0   R-6C2   diff R  0   0  C -2  -1  Move  R  0 C -1 To R-6C1
 *  R-6C1   R-6C3   diff R  0   0  C -2  -1  Move  R  0 C -1 To R-6C2
 *  R-6C2   R-5C3   diff R -1  -1  C -1  -1  Move  R  0 C  0 To R-5C3
 *  R-5C3   R-4C3   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-4C3
 *  R-4C3   R-3C3   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-3C3
 *  R-3C3   R-2C3   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-2C3
 *  R-2C3   R-1C3   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-1C3
 *  R-1C3   R0C2    diff R -1  -1  C  1   1  Move  R  0 C  0 To R0C2
 *  R0C2    R1C1    diff R -1  -1  C  1   1  Move  R  0 C  0 To R1C1
 * 
 *      32101234        32101234        32101234
 *  -6    H12321    -6              -6    H123  
 *  -5       432    -5              -5       4  
 *  -4       543    -4              -4       5  
 *  -3       654    -3              -3       6  
 *  -2       765    -2              -2       7  
 *  -1       874    -1              -1       8  
 *   0       843     0       T       0       T  
 *   1      8432     1      T        1          
 *   2     S4321     2     T         2     S    
 *   3               3               3          
 *   4               4               4          
 * 
 * Direction L Amount 8 
 *  R-6C-1  R-6C1   diff R  0   0  C -2  -1  Move  R  0 C -1 To R-6C0
 *  R-6C0   R-6C2   diff R  0   0  C -2  -1  Move  R  0 C -1 To R-6C1
 *  R-6C1   R-5C3   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R-6C2
 *  R-6C2   R-4C3   diff R -2  -1  C -1  -1  Move  R -1 C -1 To R-5C2
 *  R-5C2   R-3C3   diff R -2  -1  C -1  -1  Move  R -1 C -1 To R-4C2
 *  R-4C2   R-2C3   diff R -2  -1  C -1  -1  Move  R -1 C -1 To R-3C2
 *  R-3C2   R-1C3   diff R -2  -1  C -1  -1  Move  R -1 C -1 To R-2C2
 *  R-2C2   R0C2    diff R -2  -1  C  0   0  Move  R -1 C  0 To R-1C2
 *  R-1C2   R1C1    diff R -2  -1  C  1   1  Move  R -1 C  1 To R0C2
 * 
 *      32101234        32101234        32101234
 *  -6   H123321    -6              -6   H123   
 *  -5       432    -5              -5       4  
 *  -4       543    -4              -4       5  
 *  -3       654    -3              -3       6  
 *  -2       765    -2              -2       7  
 *  -1       874    -1              -1       8  
 *   0       843     0       T       0       T  
 *   1      8432     1      T        1          
 *   2     S4321     2     T         2     S    
 *   3               3               3          
 *   4               4               4          
 * 
 * Direction L Amount 8 
 *  R-6C-2  R-6C0   diff R  0   0  C -2  -1  Move  R  0 C -1 To R-6C-1
 *  R-6C-1  R-6C1   diff R  0   0  C -2  -1  Move  R  0 C -1 To R-6C0
 *  R-6C0   R-6C2   diff R  0   0  C -2  -1  Move  R  0 C -1 To R-6C1
 *  R-6C1   R-5C2   diff R -1  -1  C -1  -1  Move  R  0 C  0 To R-5C2
 *  R-5C2   R-4C2   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-4C2
 *  R-4C2   R-3C2   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-3C2
 *  R-3C2   R-2C2   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-2C2
 *  R-2C2   R-1C2   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-1C2
 *  R-1C2   R0C2    diff R -1  -1  C  0   0  Move  R  0 C  0 To R0C2
 * 
 *      32101234        32101234        32101234
 *  -6  H1234321    -6              -6  H1234   
 *  -5      5432    -5              -5      5   
 *  -4      6543    -4              -4      6   
 *  -3      7654    -3              -3      7   
 *  -2      8765    -2              -2      8   
 *  -1       874    -1      T       -1      T   
 *   0       843     0       T       0          
 *   1      8432     1      T        1          
 *   2     S4321     2     T         2     S    
 *   3               3               3          
 *   4               4               4          
 * 
 * Direction L Amount 8 
 *  R-6C-3  R-6C-1  diff R  0   0  C -2  -1  Move  R  0 C -1 To R-6C-2
 *  R-6C-2  R-6C0   diff R  0   0  C -2  -1  Move  R  0 C -1 To R-6C-1
 *  R-6C-1  R-6C1   diff R  0   0  C -2  -1  Move  R  0 C -1 To R-6C0
 *  R-6C0   R-5C2   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R-6C1
 *  R-6C1   R-4C2   diff R -2  -1  C -1  -1  Move  R -1 C -1 To R-5C1
 *  R-5C1   R-3C2   diff R -2  -1  C -1  -1  Move  R -1 C -1 To R-4C1
 *  R-4C1   R-2C2   diff R -2  -1  C -1  -1  Move  R -1 C -1 To R-3C1
 *  R-3C1   R-1C2   diff R -2  -1  C -1  -1  Move  R -1 C -1 To R-2C1
 *  R-2C1   R0C2    diff R -2  -1  C -1  -1  Move  R -1 C -1 To R-1C1
 * 
 *      32101234        32101234        32101234
 *  -6  H1234321    -6              -6   1234   
 *  -5  H   5432    -5              -5  H   5   
 *  -4      6543    -4              -4      6   
 *  -3      7654    -3              -3      7   
 *  -2      8765    -2              -2      8   
 *  -1       874    -1      T       -1      T   
 *   0       843     0       T       0          
 *   1      8432     1      T        1          
 *   2     S4321     2     T         2     S    
 *   3               3               3          
 *   4               4               4          
 * 
 * Direction D Amount 3 
 *  R-5C-3  R-6C-2  diff R  1   1  C -1  -1  Move  R  0 C  0 To R-6C-2
 *  R-6C-2  R-6C-1  diff R  0   0  C -1  -1  Move  R  0 C  0 To R-6C-1
 *  R-6C-1  R-6C0   diff R  0   0  C -1  -1  Move  R  0 C  0 To R-6C0
 *  R-6C0   R-6C1   diff R  0   0  C -1  -1  Move  R  0 C  0 To R-6C1
 *  R-6C1   R-5C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-5C1
 *  R-5C1   R-4C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-4C1
 *  R-4C1   R-3C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-3C1
 *  R-3C1   R-2C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-2C1
 *  R-2C1   R-1C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-1C1
 * 
 *      32101234        32101234        32101234
 *  -6  H1234321    -6              -6          
 *  -5  12345432    -5              -5  12345   
 *  -4  H   6543    -4              -4  H   6   
 *  -3      7654    -3              -3      7   
 *  -2      8765    -2              -2      8   
 *  -1       874    -1      T       -1      T   
 *   0       843     0       T       0          
 *   1      8432     1      T        1          
 *   2     S4321     2     T         2     S    
 *   3               3               3          
 *   4               4               4          
 * 
 * Direction D Amount 3 
 *  R-4C-3  R-6C-2  diff R  2   1  C -1  -1  Move  R  1 C -1 To R-5C-3
 *  R-5C-3  R-6C-1  diff R  1   1  C -2  -1  Move  R  1 C -1 To R-5C-2
 *  R-5C-2  R-6C0   diff R  1   1  C -2  -1  Move  R  1 C -1 To R-5C-1
 *  R-5C-1  R-6C1   diff R  1   1  C -2  -1  Move  R  1 C -1 To R-5C0
 *  R-5C0   R-5C1   diff R  0   0  C -1  -1  Move  R  0 C  0 To R-5C1
 *  R-5C1   R-4C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-4C1
 *  R-4C1   R-3C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-3C1
 *  R-3C1   R-2C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-2C1
 *  R-2C1   R-1C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-1C1
 * 
 *      32101234        32101234        32101234
 *  -6  H1234321    -6              -6          
 *  -5  12345432    -5              -5   2345   
 *  -4  1   6543    -4              -4  1   6   
 *  -3  H   7654    -3              -3  H   7   
 *  -2      8765    -2              -2      8   
 *  -1       874    -1      T       -1      T   
 *   0       843     0       T       0          
 *   1      8432     1      T        1          
 *   2     S4321     2     T         2     S    
 *   3               3               3          
 *   4               4               4          
 * 
 * Direction D Amount 3 
 *  R-3C-3  R-5C-3  diff R  2   1  C  0   0  Move  R  1 C  0 To R-4C-3
 *  R-4C-3  R-5C-2  diff R  1   1  C -1  -1  Move  R  0 C  0 To R-5C-2
 *  R-5C-2  R-5C-1  diff R  0   0  C -1  -1  Move  R  0 C  0 To R-5C-1
 *  R-5C-1  R-5C0   diff R  0   0  C -1  -1  Move  R  0 C  0 To R-5C0
 *  R-5C0   R-5C1   diff R  0   0  C -1  -1  Move  R  0 C  0 To R-5C1
 *  R-5C1   R-4C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-4C1
 *  R-4C1   R-3C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-3C1
 *  R-3C1   R-2C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-2C1
 *  R-2C1   R-1C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-1C1
 * 
 *      32101234        32101234        32101234
 *  -6  H1234321    -6              -6          
 *  -5  12345432    -5              -5   2345   
 *  -4  1   6543    -4              -4  1   6   
 *  -3  HH  7654    -3              -3   H  7   
 *  -2      8765    -2              -2      8   
 *  -1       874    -1      T       -1      T   
 *   0       843     0       T       0          
 *   1      8432     1      T        1          
 *   2     S4321     2     T         2     S    
 *   3               3               3          
 *   4               4               4          
 * 
 * Direction R Amount 17 
 *  R-3C-2  R-4C-3  diff R  1   1  C  1   1  Move  R  0 C  0 To R-4C-3
 *  R-4C-3  R-5C-2  diff R  1   1  C -1  -1  Move  R  0 C  0 To R-5C-2
 *  R-5C-2  R-5C-1  diff R  0   0  C -1  -1  Move  R  0 C  0 To R-5C-1
 *  R-5C-1  R-5C0   diff R  0   0  C -1  -1  Move  R  0 C  0 To R-5C0
 *  R-5C0   R-5C1   diff R  0   0  C -1  -1  Move  R  0 C  0 To R-5C1
 *  R-5C1   R-4C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-4C1
 *  R-4C1   R-3C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-3C1
 *  R-3C1   R-2C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-2C1
 *  R-2C1   R-1C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-1C1
 * 
 *      32101234        32101234        32101234
 *  -6  H1234321    -6              -6          
 *  -5  12345432    -5              -5    345   
 *  -4  12  6543    -4              -4   2  6   
 *  -3  H1H 7654    -3              -3   1H 7   
 *  -2      8765    -2              -2      8   
 *  -1       874    -1      T       -1      T   
 *   0       843     0       T       0          
 *   1      8432     1      T        1          
 *   2     S4321     2     T         2     S    
 *   3               3               3          
 *   4               4               4          
 * 
 * Direction R Amount 17 
 *  R-3C-1  R-4C-3  diff R  1   1  C  2   1  Move  R  1 C  1 To R-3C-2
 *  R-3C-2  R-5C-2  diff R  2   1  C  0   0  Move  R  1 C  0 To R-4C-2
 *  R-4C-2  R-5C-1  diff R  1   1  C -1  -1  Move  R  0 C  0 To R-5C-1
 *  R-5C-1  R-5C0   diff R  0   0  C -1  -1  Move  R  0 C  0 To R-5C0
 *  R-5C0   R-5C1   diff R  0   0  C -1  -1  Move  R  0 C  0 To R-5C1
 *  R-5C1   R-4C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-4C1
 *  R-4C1   R-3C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-3C1
 *  R-3C1   R-2C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-2C1
 *  R-2C1   R-1C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-1C1
 * 
 *      32101234        32101234        32101234
 *  -6  H1234321    -6              -6          
 *  -5  12345432    -5              -5    345   
 *  -4  12  6543    -4              -4   2  6   
 *  -3  H11H7654    -3              -3    1H7   
 *  -2      8765    -2              -2      8   
 *  -1       874    -1      T       -1      T   
 *   0       843     0       T       0          
 *   1      8432     1      T        1          
 *   2     S4321     2     T         2     S    
 *   3               3               3          
 *   4               4               4          
 * 
 * Direction R Amount 17 
 *  R-3C0   R-3C-2  diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C-1
 *  R-3C-1  R-4C-2  diff R  1   1  C  1   1  Move  R  0 C  0 To R-4C-2
 *  R-4C-2  R-5C-1  diff R  1   1  C -1  -1  Move  R  0 C  0 To R-5C-1
 *  R-5C-1  R-5C0   diff R  0   0  C -1  -1  Move  R  0 C  0 To R-5C0
 *  R-5C0   R-5C1   diff R  0   0  C -1  -1  Move  R  0 C  0 To R-5C1
 *  R-5C1   R-4C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-4C1
 *  R-4C1   R-3C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-3C1
 *  R-3C1   R-2C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-2C1
 *  R-2C1   R-1C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-1C1
 * 
 *      32101234        32101234        32101234
 *  -6  H1234321    -6              -6          
 *  -5  12345432    -5              -5     45   
 *  -4  123 6543    -4              -4    3 6   
 *  -3  H121H654    -3              -3    21H   
 *  -2      8765    -2              -2      8   
 *  -1       874    -1      T       -1      T   
 *   0       843     0       T       0          
 *   1      8432     1      T        1          
 *   2     S4321     2     T         2     S    
 *   3               3               3          
 *   4               4               4          
 * 
 * Direction R Amount 17 
 *  R-3C1   R-3C-1  diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C0
 *  R-3C0   R-4C-2  diff R  1   1  C  2   1  Move  R  1 C  1 To R-3C-1
 *  R-3C-1  R-5C-1  diff R  2   1  C  0   0  Move  R  1 C  0 To R-4C-1
 *  R-4C-1  R-5C0   diff R  1   1  C -1  -1  Move  R  0 C  0 To R-5C0
 *  R-5C0   R-5C1   diff R  0   0  C -1  -1  Move  R  0 C  0 To R-5C1
 *  R-5C1   R-4C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-4C1
 *  R-4C1   R-3C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-3C1
 *  R-3C1   R-2C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-2C1
 *  R-2C1   R-1C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-1C1
 * 
 *      32101234        32101234        32101234
 *  -6  H1234321    -6              -6          
 *  -5  12345432    -5              -5     45   
 *  -4  123 6543    -4              -4    3 6   
 *  -3  H1227H54    -3              -3     27H  
 *  -2      8765    -2              -2      8   
 *  -1       874    -1      T       -1      T   
 *   0       843     0       T       0          
 *   1      8432     1      T        1          
 *   2     S4321     2     T         2     S    
 *   3               3               3          
 *   4               4               4          
 * 
 * Direction R Amount 17 
 *  R-3C2   R-3C0   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C1
 *  R-3C1   R-3C-1  diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C0
 *  R-3C0   R-4C-1  diff R  1   1  C  1   1  Move  R  0 C  0 To R-4C-1
 *  R-4C-1  R-5C0   diff R  1   1  C -1  -1  Move  R  0 C  0 To R-5C0
 *  R-5C0   R-5C1   diff R  0   0  C -1  -1  Move  R  0 C  0 To R-5C1
 *  R-5C1   R-4C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-4C1
 *  R-4C1   R-3C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-3C1
 *  R-3C1   R-2C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-2C1
 *  R-2C1   R-1C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-1C1
 * 
 *      32101234        32101234        32101234
 *  -6  H1234321    -6              -6          
 *  -5  12345432    -5              -5      5   
 *  -4  12346543    -4              -4     46   
 *  -3  H12371H4    -3              -3     371H 
 *  -2      8765    -2              -2      8   
 *  -1       874    -1      T       -1      T   
 *   0       843     0       T       0          
 *   1      8432     1      T        1          
 *   2     S4321     2     T         2     S    
 *   3               3               3          
 *   4               4               4          
 * 
 * Direction R Amount 17 
 *  R-3C3   R-3C1   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C2
 *  R-3C2   R-3C0   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C1
 *  R-3C1   R-4C-1  diff R  1   1  C  2   1  Move  R  1 C  1 To R-3C0
 *  R-3C0   R-5C0   diff R  2   1  C  0   0  Move  R  1 C  0 To R-4C0
 *  R-4C0   R-5C1   diff R  1   1  C -1  -1  Move  R  0 C  0 To R-5C1
 *  R-5C1   R-4C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-4C1
 *  R-4C1   R-3C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-3C1
 *  R-3C1   R-2C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-2C1
 *  R-2C1   R-1C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-1C1
 * 
 *      32101234        32101234        32101234
 *  -6  H1234321    -6              -6          
 *  -5  12345432    -5              -5      5   
 *  -4  12346543    -4              -4     46   
 *  -3  H123721H    -3              -3      721H
 *  -2      8765    -2              -2      8   
 *  -1       874    -1      T       -1      T   
 *   0       843     0       T       0          
 *   1      8432     1      T        1          
 *   2     S4321     2     T         2     S    
 *   3               3               3          
 *   4               4               4          
 * 
 * Direction R Amount 17 
 *  R-3C4   R-3C2   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C3
 *  R-3C3   R-3C1   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C2
 *  R-3C2   R-3C0   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C1
 *  R-3C1   R-4C0   diff R  1   1  C  1   1  Move  R  0 C  0 To R-4C0
 *  R-4C0   R-5C1   diff R  1   1  C -1  -1  Move  R  0 C  0 To R-5C1
 *  R-5C1   R-4C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-4C1
 *  R-4C1   R-3C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-3C1
 *  R-3C1   R-2C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-2C1
 *  R-2C1   R-1C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-1C1
 * 
 *      32101234        32101234        32101234
 *  -6  H1234321    -6              -6          
 *  -5  12345432    -5              -5          
 *  -4  12346543    -4              -4      6   
 *  -3  H1237321    -3              -3      7321
 *  -2      8765    -2              -2      8   
 *  -1       874    -1      T       -1      T   
 *   0       843     0       T       0          
 *   1      8432     1      T        1          
 *   2     S4321     2     T         2     S    
 *   3               3               3          
 *   4               4               4          
 * 
 * Direction R Amount 17 
 *  R-3C5   R-3C3   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C4
 *  R-3C4   R-3C2   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C3
 *  R-3C3   R-3C1   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C2
 *  R-3C2   R-4C0   diff R  1   1  C  2   1  Move  R  1 C  1 To R-3C1
 *  R-3C1   R-5C1   diff R  2   1  C  0   0  Move  R  1 C  0 To R-4C1
 *  R-4C1   R-4C1   diff R  0   0  C  0   0  Move  R  0 C  0 To R-4C1
 *  R-4C1   R-3C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-3C1
 *  R-3C1   R-2C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-2C1
 *  R-2C1   R-1C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-1C1
 * 
 *      321012345678        321012345678        321012345678
 *  -6  H1234321H       -6                  -6              
 *  -5  123454321       -5                  -5              
 *  -4  123465432       -4                  -4      6       
 *  -3  H12374321H      -3                  -3      74321H  
 *  -2      87654       -2                  -2      8       
 *  -1       8743       -1      T           -1      T       
 *   0       8432        0       T           0              
 *   1      84321        1      T            1              
 *   2     S4321H        2     T             2     S        
 *   3                   3                   3              
 *   4                   4                   4              
 * 
 * Direction R Amount 17 
 *  R-3C6   R-3C4   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C5
 *  R-3C5   R-3C3   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C4
 *  R-3C4   R-3C2   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C3
 *  R-3C3   R-3C1   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C2
 *  R-3C2   R-4C1   diff R  1   1  C  1   1  Move  R  0 C  0 To R-4C1
 *  R-4C1   R-4C1   diff R  0   0  C  0   0  Move  R  0 C  0 To R-4C1
 *  R-4C1   R-3C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-3C1
 *  R-3C1   R-2C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-2C1
 *  R-2C1   R-1C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-1C1
 * 
 *      321012345678        321012345678        321012345678
 *  -6  H1234321H       -6                  -6              
 *  -5  123454321       -5                  -5              
 *  -4  123465432       -4                  -4      6       
 *  -3  H123754321H     -3                  -3      754321H 
 *  -2      87654       -2                  -2      8       
 *  -1       8743       -1      T           -1      T       
 *   0       8432        0       T           0              
 *   1      84321        1      T            1              
 *   2     S4321H        2     T             2     S        
 *   3                   3                   3              
 *   4                   4                   4              
 * 
 * Direction R Amount 17 
 *  R-3C7   R-3C5   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C6
 *  R-3C6   R-3C4   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C5
 *  R-3C5   R-3C3   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C4
 *  R-3C4   R-3C2   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C3
 *  R-3C3   R-4C1   diff R  1   1  C  2   1  Move  R  1 C  1 To R-3C2
 *  R-3C2   R-4C1   diff R  1   1  C  1   1  Move  R  0 C  0 To R-4C1
 *  R-4C1   R-3C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-3C1
 *  R-3C1   R-2C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-2C1
 *  R-2C1   R-1C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-1C1
 * 
 *      321012345678        321012345678        321012345678
 *  -6  H1234321H       -6                  -6              
 *  -5  123454321       -5                  -5              
 *  -4  123465432       -4                  -4              
 *  -3  H1237654321H    -3                  -3      7654321H
 *  -2      87654       -2                  -2      8       
 *  -1       8743       -1      T           -1      T       
 *   0       8432        0       T           0              
 *   1      84321        1      T            1              
 *   2     S4321H        2     T             2     S        
 *   3                   3                   3              
 *   4                   4                   4              
 * 
 * Direction R Amount 17 
 *  R-3C8   R-3C6   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C7
 *  R-3C7   R-3C5   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C6
 *  R-3C6   R-3C4   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C5
 *  R-3C5   R-3C3   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C4
 *  R-3C4   R-3C2   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C3
 *  R-3C3   R-4C1   diff R  1   1  C  2   1  Move  R  1 C  1 To R-3C2
 *  R-3C2   R-3C1   diff R  0   0  C  1   1  Move  R  0 C  0 To R-3C1
 *  R-3C1   R-2C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-2C1
 *  R-2C1   R-1C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-1C1
 * 
 *      321012345678        321012345678        321012345678
 *  -6  H1234321H       -6                  -6              
 *  -5  123454321       -5                  -5              
 *  -4  123465432       -4                  -4              
 *  -3  H12377654321    -3                  -3       7654321
 *  -2      87654       -2                  -2      8       
 *  -1       8743       -1      T           -1      T       
 *   0       8432        0       T           0              
 *   1      84321        1      T            1              
 *   2     S4321H        2     T             2     S        
 *   3                   3                   3              
 *   4                   4                   4              
 * 
 * Direction R Amount 17 
 *  R-3C9   R-3C7   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C8
 *  R-3C8   R-3C6   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C7
 *  R-3C7   R-3C5   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C6
 *  R-3C6   R-3C4   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C5
 *  R-3C5   R-3C3   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C4
 *  R-3C4   R-3C2   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C3
 *  R-3C3   R-3C1   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C2
 *  R-3C2   R-2C1   diff R -1  -1  C  1   1  Move  R  0 C  0 To R-2C1
 *  R-2C1   R-1C1   diff R -1  -1  C  0   0  Move  R  0 C  0 To R-1C1
 * 
 *      3210123456789012        3210123456789012        3210123456789012
 *  -6  H1234321H           -6                      -6                  
 *  -5  123454321           -5                      -5                  
 *  -4  123465432           -4                      -4                  
 *  -3  H123787654321H      -3                      -3       87654321H  
 *  -2      87654           -2       T              -2       T          
 *  -1       8743           -1      T               -1                  
 *   0       8432            0       T               0                  
 *   1      84321            1      T                1                  
 *   2     S4321H            2     T                 2     S            
 *   3                       3                       3                  
 *   4                       4                       4                  
 * 
 * Direction R Amount 17 
 *  R-3C10  R-3C8   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C9
 *  R-3C9   R-3C7   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C8
 *  R-3C8   R-3C6   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C7
 *  R-3C7   R-3C5   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C6
 *  R-3C6   R-3C4   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C5
 *  R-3C5   R-3C3   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C4
 *  R-3C4   R-3C2   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C3
 *  R-3C3   R-2C1   diff R -1  -1  C  2   1  Move  R -1 C  1 To R-3C2
 *  R-3C2   R-1C1   diff R -2  -1  C  1   1  Move  R -1 C  1 To R-2C2
 * 
 *      3210123456789012        3210123456789012        3210123456789012
 *  -6  H1234321H           -6                      -6                  
 *  -5  123454321           -5                      -5                  
 *  -4  123465432           -4                      -4                  
 *  -3  H1237887654321H     -3                      -3        87654321H 
 *  -2      87654           -2       T              -2       T          
 *  -1       8743           -1      T               -1                  
 *   0       8432            0       T               0                  
 *   1      84321            1      T                1                  
 *   2     S4321H            2     T                 2     S            
 *   3                       3                       3                  
 *   4                       4                       4                  
 * 
 * Direction R Amount 17 
 *  R-3C11  R-3C9   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C10
 *  R-3C10  R-3C8   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C9
 *  R-3C9   R-3C7   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C8
 *  R-3C8   R-3C6   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C7
 *  R-3C7   R-3C5   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C6
 *  R-3C6   R-3C4   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C5
 *  R-3C5   R-3C3   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C4
 *  R-3C4   R-3C2   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C3
 *  R-3C3   R-2C2   diff R -1  -1  C  1   1  Move  R  0 C  0 To R-2C2
 * 
 *      3210123456789012        3210123456789012        3210123456789012
 *  -6  H1234321H           -6                      -6                  
 *  -5  123454321           -5                      -5                  
 *  -4  123465432           -4                      -4                  
 *  -3  H12378887654321H    -3        T             -3        T87654321H
 *  -2      87654           -2       T              -2                  
 *  -1       8743           -1      T               -1                  
 *   0       8432            0       T               0                  
 *   1      84321            1      T                1                  
 *   2     S4321H            2     T                 2     S            
 *   3                       3                       3                  
 *   4                       4                       4                  
 * 
 * Direction R Amount 17 
 *  R-3C12  R-3C10  diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C11
 *  R-3C11  R-3C9   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C10
 *  R-3C10  R-3C8   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C9
 *  R-3C9   R-3C7   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C8
 *  R-3C8   R-3C6   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C7
 *  R-3C7   R-3C5   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C6
 *  R-3C6   R-3C4   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C5
 *  R-3C5   R-3C3   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C4
 *  R-3C4   R-2C2   diff R -1  -1  C  2   1  Move  R -1 C  1 To R-3C3
 * 
 *      3210123456789012        3210123456789012        3210123456789012
 *  -6  H1234321H           -6                      -6                  
 *  -5  123454321           -5                      -5                  
 *  -4  123465432           -4                      -4                  
 *  -3  H123788887654321    -3        TT            -3         T87654321
 *  -2      87654           -2       T              -2                  
 *  -1       8743           -1      T               -1                  
 *   0       8432            0       T               0                  
 *   1      84321            1      T                1                  
 *   2     S4321H            2     T                 2     S            
 *   3                       3                       3                  
 *   4                       4                       4                  
 * 
 * Direction R Amount 17 
 *  R-3C13  R-3C11  diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C12
 *  R-3C12  R-3C10  diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C11
 *  R-3C11  R-3C9   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C10
 *  R-3C10  R-3C8   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C9
 *  R-3C9   R-3C7   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C8
 *  R-3C8   R-3C6   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C7
 *  R-3C7   R-3C5   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C6
 *  R-3C6   R-3C4   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C5
 *  R-3C5   R-3C3   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C4
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  H1234321H               -6                          -6                      
 *  -5  123454321               -5                          -5                      
 *  -4  123465432               -4                          -4                      
 *  -3  H1237888887654321H      -3        TTT               -3          T87654321H  
 *  -2      87654               -2       T                  -2                      
 *  -1       8743               -1      T                   -1                      
 *   0       8432                0       T                   0                      
 *   1      84321                1      T                    1                      
 *   2     S4321H                2     T                     2     S                
 *   3                           3                           3                      
 *   4                           4                           4                      
 * 
 * Direction R Amount 17 
 *  R-3C14  R-3C12  diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C13
 *  R-3C13  R-3C11  diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C12
 *  R-3C12  R-3C10  diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C11
 *  R-3C11  R-3C9   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C10
 *  R-3C10  R-3C8   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C9
 *  R-3C9   R-3C7   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C8
 *  R-3C8   R-3C6   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C7
 *  R-3C7   R-3C5   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C6
 *  R-3C6   R-3C4   diff R  0   0  C  2   1  Move  R  0 C  1 To R-3C5
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  H1234321H               -6                          -6                      
 *  -5  123454321               -5                          -5                      
 *  -4  123465432               -4                          -4                      
 *  -3  H1237888887654321H      -3        TTT               -3          T87654321   
 *  -2      87654        H      -2       T                  -2                   H  
 *  -1       8743               -1      T                   -1                      
 *   0       8432                0       T                   0                      
 *   1      84321                1      T                    1                      
 *   2     S4321H                2     T                     2     S                
 *   3                           3                           3                      
 *   4                           4                           4                      
 * 
 * Direction D Amount 10 
 *  R-2C14  R-3C13  diff R  1   1  C  1   1  Move  R  0 C  0 To R-3C13
 *  R-3C13  R-3C12  diff R  0   0  C  1   1  Move  R  0 C  0 To R-3C12
 *  R-3C12  R-3C11  diff R  0   0  C  1   1  Move  R  0 C  0 To R-3C11
 *  R-3C11  R-3C10  diff R  0   0  C  1   1  Move  R  0 C  0 To R-3C10
 *  R-3C10  R-3C9   diff R  0   0  C  1   1  Move  R  0 C  0 To R-3C9
 *  R-3C9   R-3C8   diff R  0   0  C  1   1  Move  R  0 C  0 To R-3C8
 *  R-3C8   R-3C7   diff R  0   0  C  1   1  Move  R  0 C  0 To R-3C7
 *  R-3C7   R-3C6   diff R  0   0  C  1   1  Move  R  0 C  0 To R-3C6
 *  R-3C6   R-3C5   diff R  0   0  C  1   1  Move  R  0 C  0 To R-3C5
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  H1234321H               -6                          -6                      
 *  -5  123454321               -5                          -5                      
 *  -4  123465432               -4                          -4                      
 *  -3  H1237888887654321H      -3        TTT               -3                      
 *  -2      87654 87654321      -2       T   T              -2           T87654321  
 *  -1       8743        H      -1      T                   -1                   H  
 *   0       8432                0       T                   0                      
 *   1      84321                1      T                    1                      
 *   2     S4321H                2     T                     2     S                
 *   3                           3                           3                      
 *   4                           4                           4                      
 * 
 * Direction D Amount 10 
 *  R-1C14  R-3C13  diff R  2   1  C  1   1  Move  R  1 C  1 To R-2C14
 *  R-2C14  R-3C12  diff R  1   1  C  2   1  Move  R  1 C  1 To R-2C13
 *  R-2C13  R-3C11  diff R  1   1  C  2   1  Move  R  1 C  1 To R-2C12
 *  R-2C12  R-3C10  diff R  1   1  C  2   1  Move  R  1 C  1 To R-2C11
 *  R-2C11  R-3C9   diff R  1   1  C  2   1  Move  R  1 C  1 To R-2C10
 *  R-2C10  R-3C8   diff R  1   1  C  2   1  Move  R  1 C  1 To R-2C9
 *  R-2C9   R-3C7   diff R  1   1  C  2   1  Move  R  1 C  1 To R-2C8
 *  R-2C8   R-3C6   diff R  1   1  C  2   1  Move  R  1 C  1 To R-2C7
 *  R-2C7   R-3C5   diff R  1   1  C  2   1  Move  R  1 C  1 To R-2C6
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  H1234321H               -6                          -6                      
 *  -5  123454321               -5                          -5                      
 *  -4  123465432               -4                          -4                      
 *  -3  H1237888887654321H      -3        TTT               -3                      
 *  -2      87654 87654321      -2       T   T              -2           T8765432   
 *  -1       8743        1      -1      T                   -1                   1  
 *   0       8432        H       0       T                   0                   H  
 *   1      84321                1      T                    1                      
 *   2     S4321H                2     T                     2     S                
 *   3                           3                           3                      
 *   4                           4                           4                      
 * 
 * Direction D Amount 10 
 *  R0C14   R-2C14  diff R  2   1  C  0   0  Move  R  1 C  0 To R-1C14
 *  R-1C14  R-2C13  diff R  1   1  C  1   1  Move  R  0 C  0 To R-2C13
 *  R-2C13  R-2C12  diff R  0   0  C  1   1  Move  R  0 C  0 To R-2C12
 *  R-2C12  R-2C11  diff R  0   0  C  1   1  Move  R  0 C  0 To R-2C11
 *  R-2C11  R-2C10  diff R  0   0  C  1   1  Move  R  0 C  0 To R-2C10
 *  R-2C10  R-2C9   diff R  0   0  C  1   1  Move  R  0 C  0 To R-2C9
 *  R-2C9   R-2C8   diff R  0   0  C  1   1  Move  R  0 C  0 To R-2C8
 *  R-2C8   R-2C7   diff R  0   0  C  1   1  Move  R  0 C  0 To R-2C7
 *  R-2C7   R-2C6   diff R  0   0  C  1   1  Move  R  0 C  0 To R-2C6
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  H1234321H               -6                          -6                      
 *  -5  123454321               -5                          -5                      
 *  -4  123465432               -4                          -4                      
 *  -3  H1237888887654321H      -3        TTT               -3                      
 *  -2      87654 87654321      -2       T   T              -2                      
 *  -1       8743  8765432      -1      T     T             -1            T8765432  
 *   0       8432        1       0       T                   0                   1  
 *   1      84321        H       1      T                    1                   H  
 *   2     S4321H                2     T                     2     S                
 *   3                           3                           3                      
 *   4                           4                           4                      
 * 
 * Direction D Amount 10 
 *  R1C14   R-1C14  diff R  2   1  C  0   0  Move  R  1 C  0 To R0C14
 *  R0C14   R-2C13  diff R  2   1  C  1   1  Move  R  1 C  1 To R-1C14
 *  R-1C14  R-2C12  diff R  1   1  C  2   1  Move  R  1 C  1 To R-1C13
 *  R-1C13  R-2C11  diff R  1   1  C  2   1  Move  R  1 C  1 To R-1C12
 *  R-1C12  R-2C10  diff R  1   1  C  2   1  Move  R  1 C  1 To R-1C11
 *  R-1C11  R-2C9   diff R  1   1  C  2   1  Move  R  1 C  1 To R-1C10
 *  R-1C10  R-2C8   diff R  1   1  C  2   1  Move  R  1 C  1 To R-1C9
 *  R-1C9   R-2C7   diff R  1   1  C  2   1  Move  R  1 C  1 To R-1C8
 *  R-1C8   R-2C6   diff R  1   1  C  2   1  Move  R  1 C  1 To R-1C7
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  H1234321H               -6                          -6                      
 *  -5  123454321               -5                          -5                      
 *  -4  123465432               -4                          -4                      
 *  -3  H1237888887654321H      -3        TTT               -3                      
 *  -2      87654 87654321      -2       T   T              -2                      
 *  -1       8743  8765432      -1      T     T             -1            T876543   
 *   0       8432        2       0       T                   0                   2  
 *   1      84321        1       1      T                    1                   1  
 *   2     S4321H        H       2     T                     2     S             H  
 *   3                           3                           3                      
 *   4                           4                           4                      
 * 
 * Direction D Amount 10 
 *  R2C14   R0C14   diff R  2   1  C  0   0  Move  R  1 C  0 To R1C14
 *  R1C14   R-1C14  diff R  2   1  C  0   0  Move  R  1 C  0 To R0C14
 *  R0C14   R-1C13  diff R  1   1  C  1   1  Move  R  0 C  0 To R-1C13
 *  R-1C13  R-1C12  diff R  0   0  C  1   1  Move  R  0 C  0 To R-1C12
 *  R-1C12  R-1C11  diff R  0   0  C  1   1  Move  R  0 C  0 To R-1C11
 *  R-1C11  R-1C10  diff R  0   0  C  1   1  Move  R  0 C  0 To R-1C10
 *  R-1C10  R-1C9   diff R  0   0  C  1   1  Move  R  0 C  0 To R-1C9
 *  R-1C9   R-1C8   diff R  0   0  C  1   1  Move  R  0 C  0 To R-1C8
 *  R-1C8   R-1C7   diff R  0   0  C  1   1  Move  R  0 C  0 To R-1C7
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  H1234321H               -6                          -6                      
 *  -5  123454321               -5                          -5                      
 *  -4  123465432               -4                          -4                      
 *  -3  H1237888887654321H      -3        TTT               -3                      
 *  -2      87654 87654321      -2       T   T              -2                      
 *  -1       8743  8765432      -1      T     T             -1                      
 *   0       8432   876543       0       T     T             0             T876543  
 *   1      84321        2       1      T                    1                   2  
 *   2     S4321H        1       2     T                     2     S             1  
 *   3                   H       3                           3                   H  
 *   4                           4                           4                      
 * 
 * Direction D Amount 10 
 *  R3C14   R1C14   diff R  2   1  C  0   0  Move  R  1 C  0 To R2C14
 *  R2C14   R0C14   diff R  2   1  C  0   0  Move  R  1 C  0 To R1C14
 *  R1C14   R-1C13  diff R  2   1  C  1   1  Move  R  1 C  1 To R0C14
 *  R0C14   R-1C12  diff R  1   1  C  2   1  Move  R  1 C  1 To R0C13
 *  R0C13   R-1C11  diff R  1   1  C  2   1  Move  R  1 C  1 To R0C12
 *  R0C12   R-1C10  diff R  1   1  C  2   1  Move  R  1 C  1 To R0C11
 *  R0C11   R-1C9   diff R  1   1  C  2   1  Move  R  1 C  1 To R0C10
 *  R0C10   R-1C8   diff R  1   1  C  2   1  Move  R  1 C  1 To R0C9
 *  R0C9    R-1C7   diff R  1   1  C  2   1  Move  R  1 C  1 To R0C8
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  H1234321H               -6                          -6                      
 *  -5  123454321               -5                          -5                      
 *  -4  123465432               -4                          -4                      
 *  -3  H1237888887654321H      -3        TTT               -3                      
 *  -2      87654 87654321      -2       T   T              -2                      
 *  -1       8743  8765432      -1      T     T             -1                      
 *   0       8432   876543       0       T     T             0             T87654   
 *   1      84321        3       1      T                    1                   3  
 *   2     S4321H        2       2     T                     2     S             2  
 *   3                   1       3                           3                   1  
 *   4                   H       4                           4                   H  
 * 
 * Direction D Amount 10 
 *  R4C14   R2C14   diff R  2   1  C  0   0  Move  R  1 C  0 To R3C14
 *  R3C14   R1C14   diff R  2   1  C  0   0  Move  R  1 C  0 To R2C14
 *  R2C14   R0C14   diff R  2   1  C  0   0  Move  R  1 C  0 To R1C14
 *  R1C14   R0C13   diff R  1   1  C  1   1  Move  R  0 C  0 To R0C13
 *  R0C13   R0C12   diff R  0   0  C  1   1  Move  R  0 C  0 To R0C12
 *  R0C12   R0C11   diff R  0   0  C  1   1  Move  R  0 C  0 To R0C11
 *  R0C11   R0C10   diff R  0   0  C  1   1  Move  R  0 C  0 To R0C10
 *  R0C10   R0C9    diff R  0   0  C  1   1  Move  R  0 C  0 To R0C9
 *  R0C9    R0C8    diff R  0   0  C  1   1  Move  R  0 C  0 To R0C8
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  H1234321H               -6                          -6                      
 *  -5  123454321               -5                          -5                      
 *  -4  123465432               -4                          -4                      
 *  -3  H1237888887654321H      -3        TTT               -3                      
 *  -2      87654 87654321      -2       T   T              -2                      
 *  -1       8743  8765432      -1      T     T             -1                      
 *   0       8432   876543       0       T     T             0                      
 *   1      84321    87654       1      T       T            1              T87654  
 *   2     S4321H        3       2     T                     2     S             3  
 *   3                   2       3                           3                   2  
 *   4                   1       4                           4                   1  
 * 
 * Direction D Amount 10 
 *  R5C14   R3C14   diff R  2   1  C  0   0  Move  R  1 C  0 To R4C14
 *  R4C14   R2C14   diff R  2   1  C  0   0  Move  R  1 C  0 To R3C14
 *  R3C14   R1C14   diff R  2   1  C  0   0  Move  R  1 C  0 To R2C14
 *  R2C14   R0C13   diff R  2   1  C  1   1  Move  R  1 C  1 To R1C14
 *  R1C14   R0C12   diff R  1   1  C  2   1  Move  R  1 C  1 To R1C13
 *  R1C13   R0C11   diff R  1   1  C  2   1  Move  R  1 C  1 To R1C12
 *  R1C12   R0C10   diff R  1   1  C  2   1  Move  R  1 C  1 To R1C11
 *  R1C11   R0C9    diff R  1   1  C  2   1  Move  R  1 C  1 To R1C10
 *  R1C10   R0C8    diff R  1   1  C  2   1  Move  R  1 C  1 To R1C9
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  H1234321H               -6                          -6                      
 *  -5  123454321               -5                          -5                      
 *  -4  123465432               -4                          -4                      
 *  -3  H1237888887654321H      -3        TTT               -3                      
 *  -2      87654 87654321      -2       T   T              -2                      
 *  -1       8743  8765432      -1      T     T             -1                      
 *   0       8432   876543       0       T     T             0                      
 *   1      84321    87654       1      T       T            1              T8765   
 *   2     S4321H        4       2     T                     2     S             4  
 *   3                   3       3                           3                   3  
 *   4                   2       4                           4                   2  
 *   5                   1       5                           5                   1  
 *   6                   H       6                           6                   H  
 *   7                           7                           7                      
 *   8                           8                           8                      
 * 
 * Direction D Amount 10 
 *  R6C14   R4C14   diff R  2   1  C  0   0  Move  R  1 C  0 To R5C14
 *  R5C14   R3C14   diff R  2   1  C  0   0  Move  R  1 C  0 To R4C14
 *  R4C14   R2C14   diff R  2   1  C  0   0  Move  R  1 C  0 To R3C14
 *  R3C14   R1C14   diff R  2   1  C  0   0  Move  R  1 C  0 To R2C14
 *  R2C14   R1C13   diff R  1   1  C  1   1  Move  R  0 C  0 To R1C13
 *  R1C13   R1C12   diff R  0   0  C  1   1  Move  R  0 C  0 To R1C12
 *  R1C12   R1C11   diff R  0   0  C  1   1  Move  R  0 C  0 To R1C11
 *  R1C11   R1C10   diff R  0   0  C  1   1  Move  R  0 C  0 To R1C10
 *  R1C10   R1C9    diff R  0   0  C  1   1  Move  R  0 C  0 To R1C9
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  H1234321H               -6                          -6                      
 *  -5  123454321               -5                          -5                      
 *  -4  123465432               -4                          -4                      
 *  -3  H1237888887654321H      -3        TTT               -3                      
 *  -2      87654 87654321      -2       T   T              -2                      
 *  -1       8743  8765432      -1      T     T             -1                      
 *   0       8432   876543       0       T     T             0                      
 *   1      84321    87654       1      T       T            1                      
 *   2     S4321H     8765       2     T         T           2     S         T8765  
 *   3                   4       3                           3                   4  
 *   4                   3       4                           4                   3  
 *   5                   2       5                           5                   2  
 *   6                   1       6                           6                   1  
 *   7                   H       7                           7                   H  
 *   8                           8                           8                      
 * 
 * Direction D Amount 10 
 *  R7C14   R5C14   diff R  2   1  C  0   0  Move  R  1 C  0 To R6C14
 *  R6C14   R4C14   diff R  2   1  C  0   0  Move  R  1 C  0 To R5C14
 *  R5C14   R3C14   diff R  2   1  C  0   0  Move  R  1 C  0 To R4C14
 *  R4C14   R2C14   diff R  2   1  C  0   0  Move  R  1 C  0 To R3C14
 *  R3C14   R1C13   diff R  2   1  C  1   1  Move  R  1 C  1 To R2C14
 *  R2C14   R1C12   diff R  1   1  C  2   1  Move  R  1 C  1 To R2C13
 *  R2C13   R1C11   diff R  1   1  C  2   1  Move  R  1 C  1 To R2C12
 *  R2C12   R1C10   diff R  1   1  C  2   1  Move  R  1 C  1 To R2C11
 *  R2C11   R1C9    diff R  1   1  C  2   1  Move  R  1 C  1 To R2C10
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  H1234321H               -6                          -6                      
 *  -5  123454321               -5                          -5                      
 *  -4  123465432               -4                          -4                      
 *  -3  H1237888887654321H      -3        TTT               -3                      
 *  -2      87654 87654321      -2       T   T              -2                      
 *  -1       8743  8765432      -1      T     T             -1                      
 *   0       8432   876543       0       T     T             0                      
 *   1      84321    87654       1      T       T            1                      
 *   2     S4321H     8765       2     T         T           2     S         T8765  
 *   3                   4       3                           3                   4  
 *   4                   3       4                           4                   3  
 *   5                   2       5                           5                   2  
 *   6                   1       6                           6                   1  
 *   7                  HH       7                           7                  H   
 *   8                           8                           8                      
 * 
 * Direction L Amount 25 
 *  R7C13   R6C14   diff R  1   1  C -1  -1  Move  R  0 C  0 To R6C14
 *  R6C14   R5C14   diff R  1   1  C  0   0  Move  R  0 C  0 To R5C14
 *  R5C14   R4C14   diff R  1   1  C  0   0  Move  R  0 C  0 To R4C14
 *  R4C14   R3C14   diff R  1   1  C  0   0  Move  R  0 C  0 To R3C14
 *  R3C14   R2C14   diff R  1   1  C  0   0  Move  R  0 C  0 To R2C14
 *  R2C14   R2C13   diff R  0   0  C  1   1  Move  R  0 C  0 To R2C13
 *  R2C13   R2C12   diff R  0   0  C  1   1  Move  R  0 C  0 To R2C12
 *  R2C12   R2C11   diff R  0   0  C  1   1  Move  R  0 C  0 To R2C11
 *  R2C11   R2C10   diff R  0   0  C  1   1  Move  R  0 C  0 To R2C10
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  H1234321H               -6                          -6                      
 *  -5  123454321               -5                          -5                      
 *  -4  123465432               -4                          -4                      
 *  -3  H1237888887654321H      -3        TTT               -3                      
 *  -2      87654 87654321      -2       T   T              -2                      
 *  -1       8743  8765432      -1      T     T             -1                      
 *   0       8432   876543       0       T     T             0                      
 *   1      84321    87654       1      T       T            1                      
 *   2     S4321H     8765       2     T         T           2     S         T876   
 *   3                  54       3                           3                  5   
 *   4                  43       4                           4                  4   
 *   5                  32       5                           5                  3   
 *   6                  21       6                           6                  2   
 *   7                 H1H       7                           7                 H1   
 *   8                           8                           8                      
 * 
 * Direction L Amount 25 
 *  R7C12   R6C14   diff R  1   1  C -2  -1  Move  R  1 C -1 To R7C13
 *  R7C13   R5C14   diff R  2   1  C -1  -1  Move  R  1 C -1 To R6C13
 *  R6C13   R4C14   diff R  2   1  C -1  -1  Move  R  1 C -1 To R5C13
 *  R5C13   R3C14   diff R  2   1  C -1  -1  Move  R  1 C -1 To R4C13
 *  R4C13   R2C14   diff R  2   1  C -1  -1  Move  R  1 C -1 To R3C13
 *  R3C13   R2C13   diff R  1   1  C  0   0  Move  R  0 C  0 To R2C13
 *  R2C13   R2C12   diff R  0   0  C  1   1  Move  R  0 C  0 To R2C12
 *  R2C12   R2C11   diff R  0   0  C  1   1  Move  R  0 C  0 To R2C11
 *  R2C11   R2C10   diff R  0   0  C  1   1  Move  R  0 C  0 To R2C10
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  H1234321H               -6                          -6                      
 *  -5  123454321               -5                          -5                      
 *  -4  123465432               -4                          -4                      
 *  -3  H1237888887654321H      -3        TTT               -3                      
 *  -2      87654 87654321      -2       T   T              -2                      
 *  -1       8743  8765432      -1      T     T             -1                      
 *   0       8432   876543       0       T     T             0                      
 *   1      84321    87654       1      T       T            1                      
 *   2     S4321H     8765       2     T         T           2     S         T876   
 *   3                  54       3                           3                  5   
 *   4                  43       4                           4                  4   
 *   5                  32       5                           5                  3   
 *   6                  21       6                           6                  2   
 *   7                H11H       7                           7                H1    
 *   8                           8                           8                      
 * 
 * Direction L Amount 25 
 *  R7C11   R7C13   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C12
 *  R7C12   R6C13   diff R  1   1  C -1  -1  Move  R  0 C  0 To R6C13
 *  R6C13   R5C13   diff R  1   1  C  0   0  Move  R  0 C  0 To R5C13
 *  R5C13   R4C13   diff R  1   1  C  0   0  Move  R  0 C  0 To R4C13
 *  R4C13   R3C13   diff R  1   1  C  0   0  Move  R  0 C  0 To R3C13
 *  R3C13   R2C13   diff R  1   1  C  0   0  Move  R  0 C  0 To R2C13
 *  R2C13   R2C12   diff R  0   0  C  1   1  Move  R  0 C  0 To R2C12
 *  R2C12   R2C11   diff R  0   0  C  1   1  Move  R  0 C  0 To R2C11
 *  R2C11   R2C10   diff R  0   0  C  1   1  Move  R  0 C  0 To R2C10
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  H1234321H               -6                          -6                      
 *  -5  123454321               -5                          -5                      
 *  -4  123465432               -4                          -4                      
 *  -3  H1237888887654321H      -3        TTT               -3                      
 *  -2      87654 87654321      -2       T   T              -2                      
 *  -1       8743  8765432      -1      T     T             -1                      
 *   0       8432   876543       0       T     T             0                      
 *   1      84321    87654       1      T       T            1                      
 *   2     S4321H     8765       2     T         T           2     S         T87    
 *   3                 654       3                           3                 6    
 *   4                 543       4                           4                 5    
 *   5                 432       5                           5                 4    
 *   6                 321       6                           6                 3    
 *   7               H121H       7                           7               H12    
 *   8                           8                           8                      
 * 
 * Direction L Amount 25 
 *  R7C10   R7C12   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C11
 *  R7C11   R6C13   diff R  1   1  C -2  -1  Move  R  1 C -1 To R7C12
 *  R7C12   R5C13   diff R  2   1  C -1  -1  Move  R  1 C -1 To R6C12
 *  R6C12   R4C13   diff R  2   1  C -1  -1  Move  R  1 C -1 To R5C12
 *  R5C12   R3C13   diff R  2   1  C -1  -1  Move  R  1 C -1 To R4C12
 *  R4C12   R2C13   diff R  2   1  C -1  -1  Move  R  1 C -1 To R3C12
 *  R3C12   R2C12   diff R  1   1  C  0   0  Move  R  0 C  0 To R2C12
 *  R2C12   R2C11   diff R  0   0  C  1   1  Move  R  0 C  0 To R2C11
 *  R2C11   R2C10   diff R  0   0  C  1   1  Move  R  0 C  0 To R2C10
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  H1234321H               -6                          -6                      
 *  -5  123454321               -5                          -5                      
 *  -4  123465432               -4                          -4                      
 *  -3  H1237888887654321H      -3        TTT               -3                      
 *  -2      87654 87654321      -2       T   T              -2                      
 *  -1       8743  8765432      -1      T     T             -1                      
 *   0       8432   876543       0       T     T             0                      
 *   1      84321    87654       1      T       T            1                      
 *   2     S4321H     8765       2     T         T           2     S         T87    
 *   3                 654       3                           3                 6    
 *   4                 543       4                           4                 5    
 *   5                 432       5                           5                 4    
 *   6                 321       6                           6                 3    
 *   7              H1221H       7                           7              H12     
 *   8                           8                           8                      
 * 
 * Direction L Amount 25 
 *  R7C9    R7C11   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C10
 *  R7C10   R7C12   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C11
 *  R7C11   R6C12   diff R  1   1  C -1  -1  Move  R  0 C  0 To R6C12
 *  R6C12   R5C12   diff R  1   1  C  0   0  Move  R  0 C  0 To R5C12
 *  R5C12   R4C12   diff R  1   1  C  0   0  Move  R  0 C  0 To R4C12
 *  R4C12   R3C12   diff R  1   1  C  0   0  Move  R  0 C  0 To R3C12
 *  R3C12   R2C12   diff R  1   1  C  0   0  Move  R  0 C  0 To R2C12
 *  R2C12   R2C11   diff R  0   0  C  1   1  Move  R  0 C  0 To R2C11
 *  R2C11   R2C10   diff R  0   0  C  1   1  Move  R  0 C  0 To R2C10
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  H1234321H               -6                          -6                      
 *  -5  123454321               -5                          -5                      
 *  -4  123465432               -4                          -4                      
 *  -3  H1237888887654321H      -3        TTT               -3                      
 *  -2      87654 87654321      -2       T   T              -2                      
 *  -1       8743  8765432      -1      T     T             -1                      
 *   0       8432   876543       0       T     T             0                      
 *   1      84321    87654       1      T       T            1                      
 *   2     S4321H     8765       2     T         T           2     S         T8     
 *   3                7654       3                           3                7     
 *   4                6543       4                           4                6     
 *   5                5432       5                           5                5     
 *   6                4321       6                           6                4     
 *   7             H12321H       7                           7             H123     
 *   8                           8                           8                      
 * 
 * Direction L Amount 25 
 *  R7C8    R7C10   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C9
 *  R7C9    R7C11   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C10
 *  R7C10   R6C12   diff R  1   1  C -2  -1  Move  R  1 C -1 To R7C11
 *  R7C11   R5C12   diff R  2   1  C -1  -1  Move  R  1 C -1 To R6C11
 *  R6C11   R4C12   diff R  2   1  C -1  -1  Move  R  1 C -1 To R5C11
 *  R5C11   R3C12   diff R  2   1  C -1  -1  Move  R  1 C -1 To R4C11
 *  R4C11   R2C12   diff R  2   1  C -1  -1  Move  R  1 C -1 To R3C11
 *  R3C11   R2C11   diff R  1   1  C  0   0  Move  R  0 C  0 To R2C11
 *  R2C11   R2C10   diff R  0   0  C  1   1  Move  R  0 C  0 To R2C10
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  H1234321H               -6                          -6                      
 *  -5  123454321               -5                          -5                      
 *  -4  123465432               -4                          -4                      
 *  -3  H1237888887654321H      -3        TTT               -3                      
 *  -2      87654 87654321      -2       T   T              -2                      
 *  -1       8743  8765432      -1      T     T             -1                      
 *   0       8432   876543       0       T     T             0                      
 *   1      84321    87654       1      T       T            1                      
 *   2     S4321H     8765       2     T         T           2     S         T8     
 *   3                7654       3                           3                7     
 *   4                6543       4                           4                6     
 *   5                5432       5                           5                5     
 *   6                4321       6                           6                4     
 *   7            H123321H       7                           7            H123      
 *   8                           8                           8                      
 * 
 * Direction L Amount 25 
 *  R7C7    R7C9    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C8
 *  R7C8    R7C10   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C9
 *  R7C9    R7C11   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C10
 *  R7C10   R6C11   diff R  1   1  C -1  -1  Move  R  0 C  0 To R6C11
 *  R6C11   R5C11   diff R  1   1  C  0   0  Move  R  0 C  0 To R5C11
 *  R5C11   R4C11   diff R  1   1  C  0   0  Move  R  0 C  0 To R4C11
 *  R4C11   R3C11   diff R  1   1  C  0   0  Move  R  0 C  0 To R3C11
 *  R3C11   R2C11   diff R  1   1  C  0   0  Move  R  0 C  0 To R2C11
 *  R2C11   R2C10   diff R  0   0  C  1   1  Move  R  0 C  0 To R2C10
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  H1234321H               -6                          -6                      
 *  -5  123454321               -5                          -5                      
 *  -4  123465432               -4                          -4                      
 *  -3  H1237888887654321H      -3        TTT               -3                      
 *  -2      87654 87654321      -2       T   T              -2                      
 *  -1       8743  8765432      -1      T     T             -1                      
 *   0       8432   876543       0       T     T             0                      
 *   1      84321    87654       1      T       T            1                      
 *   2     S4321H     8765       2     T         T           2     S         T      
 *   3               87654       3                           3               8      
 *   4               76543       4                           4               7      
 *   5               65432       5                           5               6      
 *   6               54321       6                           6               5      
 *   7           H1234321H       7                           7           H1234      
 *   8                           8                           8                      
 * 
 * Direction L Amount 25 
 *  R7C6    R7C8    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C7
 *  R7C7    R7C9    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C8
 *  R7C8    R7C10   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C9
 *  R7C9    R6C11   diff R  1   1  C -2  -1  Move  R  1 C -1 To R7C10
 *  R7C10   R5C11   diff R  2   1  C -1  -1  Move  R  1 C -1 To R6C10
 *  R6C10   R4C11   diff R  2   1  C -1  -1  Move  R  1 C -1 To R5C10
 *  R5C10   R3C11   diff R  2   1  C -1  -1  Move  R  1 C -1 To R4C10
 *  R4C10   R2C11   diff R  2   1  C -1  -1  Move  R  1 C -1 To R3C10
 *  R3C10   R2C10   diff R  1   1  C  0   0  Move  R  0 C  0 To R2C10
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  H1234321H               -6                          -6                      
 *  -5  123454321               -5                          -5                      
 *  -4  123465432               -4                          -4                      
 *  -3  H1237888887654321H      -3        TTT               -3                      
 *  -2      87654 87654321      -2       T   T              -2                      
 *  -1       8743  8765432      -1      T     T             -1                      
 *   0       8432   876543       0       T     T             0                      
 *   1      84321    87654       1      T       T            1                      
 *   2     S4321H     8765       2     T         T           2     S         T      
 *   3               87654       3                           3               8      
 *   4               76543       4                           4               7      
 *   5               65432       5                           5               6      
 *   6               54321       6                           6               5      
 *   7          H12344321H       7                           7          H1234       
 *   8                           8                           8                      
 * 
 * Direction L Amount 25 
 *  R7C5    R7C7    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C6
 *  R7C6    R7C8    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C7
 *  R7C7    R7C9    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C8
 *  R7C8    R7C10   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C9
 *  R7C9    R6C10   diff R  1   1  C -1  -1  Move  R  0 C  0 To R6C10
 *  R6C10   R5C10   diff R  1   1  C  0   0  Move  R  0 C  0 To R5C10
 *  R5C10   R4C10   diff R  1   1  C  0   0  Move  R  0 C  0 To R4C10
 *  R4C10   R3C10   diff R  1   1  C  0   0  Move  R  0 C  0 To R3C10
 *  R3C10   R2C10   diff R  1   1  C  0   0  Move  R  0 C  0 To R2C10
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  H1234321H               -6                          -6                      
 *  -5  123454321               -5                          -5                      
 *  -4  123465432               -4                          -4                      
 *  -3  H1237888887654321H      -3        TTT               -3                      
 *  -2      87654 87654321      -2       T   T              -2                      
 *  -1       8743  8765432      -1      T     T             -1                      
 *   0       8432   876543       0       T     T             0                      
 *   1      84321    87654       1      T       T            1                      
 *   2     S4321H     8765       2     T         T           2     S                
 *   3               87654       3              T            3              T       
 *   4              876543       4                           4              8       
 *   5              765432       5                           5              7       
 *   6              654321       6                           6              6       
 *   7         H123454321H       7                           7         H12345       
 *   8                           8                           8                      
 * 
 * Direction L Amount 25 
 *  R7C4    R7C6    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C5
 *  R7C5    R7C7    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C6
 *  R7C6    R7C8    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C7
 *  R7C7    R7C9    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C8
 *  R7C8    R6C10   diff R  1   1  C -2  -1  Move  R  1 C -1 To R7C9
 *  R7C9    R5C10   diff R  2   1  C -1  -1  Move  R  1 C -1 To R6C9
 *  R6C9    R4C10   diff R  2   1  C -1  -1  Move  R  1 C -1 To R5C9
 *  R5C9    R3C10   diff R  2   1  C -1  -1  Move  R  1 C -1 To R4C9
 *  R4C9    R2C10   diff R  2   1  C -1  -1  Move  R  1 C -1 To R3C9
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  H1234321H               -6                          -6                      
 *  -5  123454321               -5                          -5                      
 *  -4  123465432               -4                          -4                      
 *  -3  H1237888887654321H      -3        TTT               -3                      
 *  -2      87654 87654321      -2       T   T              -2                      
 *  -1       8743  8765432      -1      T     T             -1                      
 *   0       8432   876543       0       T     T             0                      
 *   1      84321    87654       1      T       T            1                      
 *   2     S4321H     8765       2     T         T           2     S                
 *   3               87654       3              T            3              T       
 *   4              876543       4                           4              8       
 *   5              765432       5                           5              7       
 *   6              654321       6                           6              6       
 *   7        H1234554321H       7                           7        H12345        
 *   8                           8                           8                      
 * 
 * Direction L Amount 25 
 *  R7C3    R7C5    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C4
 *  R7C4    R7C6    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C5
 *  R7C5    R7C7    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C6
 *  R7C6    R7C8    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C7
 *  R7C7    R7C9    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C8
 *  R7C8    R6C9    diff R  1   1  C -1  -1  Move  R  0 C  0 To R6C9
 *  R6C9    R5C9    diff R  1   1  C  0   0  Move  R  0 C  0 To R5C9
 *  R5C9    R4C9    diff R  1   1  C  0   0  Move  R  0 C  0 To R4C9
 *  R4C9    R3C9    diff R  1   1  C  0   0  Move  R  0 C  0 To R3C9
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  H1234321H               -6                          -6                      
 *  -5  123454321               -5                          -5                      
 *  -4  123465432               -4                          -4                      
 *  -3  H1237888887654321H      -3        TTT               -3                      
 *  -2      87654 87654321      -2       T   T              -2                      
 *  -1       8743  8765432      -1      T     T             -1                      
 *   0       8432   876543       0       T     T             0                      
 *   1      84321    87654       1      T       T            1                      
 *   2     S4321H     8765       2     T         T           2     S                
 *   3               87654       3              T            3                      
 *   4              876543       4             T             4             T        
 *   5             8765432       5                           5             8        
 *   6             7654321       6                           6             7        
 *   7       H12345654321H       7                           7       H123456        
 *   8                           8                           8                      
 * 
 * Direction L Amount 25 
 *  R7C2    R7C4    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C3
 *  R7C3    R7C5    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C4
 *  R7C4    R7C6    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C5
 *  R7C5    R7C7    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C6
 *  R7C6    R7C8    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C7
 *  R7C7    R6C9    diff R  1   1  C -2  -1  Move  R  1 C -1 To R7C8
 *  R7C8    R5C9    diff R  2   1  C -1  -1  Move  R  1 C -1 To R6C8
 *  R6C8    R4C9    diff R  2   1  C -1  -1  Move  R  1 C -1 To R5C8
 *  R5C8    R3C9    diff R  2   1  C -1  -1  Move  R  1 C -1 To R4C8
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  H1234321H               -6                          -6                      
 *  -5  123454321               -5                          -5                      
 *  -4  123465432               -4                          -4                      
 *  -3  H1237888887654321H      -3        TTT               -3                      
 *  -2      87654 87654321      -2       T   T              -2                      
 *  -1       8743  8765432      -1      T     T             -1                      
 *   0       8432   876543       0       T     T             0                      
 *   1      84321    87654       1      T       T            1                      
 *   2     S4321H     8765       2     T         T           2     S                
 *   3               87654       3              T            3                      
 *   4              876543       4             T             4             T        
 *   5             8765432       5                           5             8        
 *   6             7654321       6                           6             7        
 *   7      H123456654321H       7                           7      H123456         
 *   8                           8                           8                      
 * 
 * Direction L Amount 25 
 *  R7C1    R7C3    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C2
 *  R7C2    R7C4    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C3
 *  R7C3    R7C5    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C4
 *  R7C4    R7C6    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C5
 *  R7C5    R7C7    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C6
 *  R7C6    R7C8    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C7
 *  R7C7    R6C8    diff R  1   1  C -1  -1  Move  R  0 C  0 To R6C8
 *  R6C8    R5C8    diff R  1   1  C  0   0  Move  R  0 C  0 To R5C8
 *  R5C8    R4C8    diff R  1   1  C  0   0  Move  R  0 C  0 To R4C8
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  H1234321H               -6                          -6                      
 *  -5  123454321               -5                          -5                      
 *  -4  123465432               -4                          -4                      
 *  -3  H1237888887654321H      -3        TTT               -3                      
 *  -2      87654 87654321      -2       T   T              -2                      
 *  -1       8743  8765432      -1      T     T             -1                      
 *   0       8432   876543       0       T     T             0                      
 *   1      84321    87654       1      T       T            1                      
 *   2     S4321H     8765       2     T         T           2     S                
 *   3               87654       3              T            3                      
 *   4              876543       4             T             4                      
 *   5             8765432       5            T              5            T         
 *   6            87654321       6                           6            8         
 *   7     H1234567654321H       7                           7     H1234567         
 *   8                           8                           8                      
 * 
 * Direction L Amount 25 
 *  R7C0    R7C2    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C1
 *  R7C1    R7C3    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C2
 *  R7C2    R7C4    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C3
 *  R7C3    R7C5    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C4
 *  R7C4    R7C6    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C5
 *  R7C5    R7C7    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C6
 *  R7C6    R6C8    diff R  1   1  C -2  -1  Move  R  1 C -1 To R7C7
 *  R7C7    R5C8    diff R  2   1  C -1  -1  Move  R  1 C -1 To R6C7
 *  R6C7    R4C8    diff R  2   1  C -1  -1  Move  R  1 C -1 To R5C7
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  H1234321H               -6                          -6                      
 *  -5  123454321               -5                          -5                      
 *  -4  123465432               -4                          -4                      
 *  -3  H1237888887654321H      -3        TTT               -3                      
 *  -2      87654 87654321      -2       T   T              -2                      
 *  -1       8743  8765432      -1      T     T             -1                      
 *   0       8432   876543       0       T     T             0                      
 *   1      84321    87654       1      T       T            1                      
 *   2     S4321H     8765       2     T         T           2     S                
 *   3               87654       3              T            3                      
 *   4              876543       4             T             4                      
 *   5             8765432       5            T              5            T         
 *   6            87654321       6                           6            8         
 *   7    H12345677654321H       7                           7    H1234567          
 *   8                           8                           8                      
 * 
 * Direction L Amount 25 
 *  R7C-1   R7C1    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C0
 *  R7C0    R7C2    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C1
 *  R7C1    R7C3    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C2
 *  R7C2    R7C4    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C3
 *  R7C3    R7C5    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C4
 *  R7C4    R7C6    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C5
 *  R7C5    R7C7    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C6
 *  R7C6    R6C7    diff R  1   1  C -1  -1  Move  R  0 C  0 To R6C7
 *  R6C7    R5C7    diff R  1   1  C  0   0  Move  R  0 C  0 To R5C7
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  H1234321H               -6                          -6                      
 *  -5  123454321               -5                          -5                      
 *  -4  123465432               -4                          -4                      
 *  -3  H1237888887654321H      -3        TTT               -3                      
 *  -2      87654 87654321      -2       T   T              -2                      
 *  -1       8743  8765432      -1      T     T             -1                      
 *   0       8432   876543       0       T     T             0                      
 *   1      84321    87654       1      T       T            1                      
 *   2     S4321H     8765       2     T         T           2     S                
 *   3               87654       3              T            3                      
 *   4              876543       4             T             4                      
 *   5             8765432       5            T              5                      
 *   6            87654321       6           T               6           T          
 *   7   H123456787654321H       7                           7   H12345678          
 *   8                           8                           8                      
 * 
 * Direction L Amount 25 
 *  R7C-2   R7C0    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-1
 *  R7C-1   R7C1    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C0
 *  R7C0    R7C2    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C1
 *  R7C1    R7C3    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C2
 *  R7C2    R7C4    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C3
 *  R7C3    R7C5    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C4
 *  R7C4    R7C6    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C5
 *  R7C5    R6C7    diff R  1   1  C -2  -1  Move  R  1 C -1 To R7C6
 *  R7C6    R5C7    diff R  2   1  C -1  -1  Move  R  1 C -1 To R6C6
 * 
 *      32101234567890123456        32101234567890123456        32101234567890123456
 *  -6  H1234321H               -6                          -6                      
 *  -5  123454321               -5                          -5                      
 *  -4  123465432               -4                          -4                      
 *  -3  H1237888887654321H      -3        TTT               -3                      
 *  -2      87654 87654321      -2       T   T              -2                      
 *  -1       8743  8765432      -1      T     T             -1                      
 *   0       8432   876543       0       T     T             0                      
 *   1      84321    87654       1      T       T            1                      
 *   2     S4321H     8765       2     T         T           2     S                
 *   3               87654       3              T            3                      
 *   4              876543       4             T             4                      
 *   5             8765432       5            T              5                      
 *   6            87654321       6           T               6           T          
 *   7  H1234567887654321H       7                           7  H12345678           
 *   8                           8                           8                      
 * 
 * Direction L Amount 25 
 *  R7C-3   R7C-1   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-2
 *  R7C-2   R7C0    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-1
 *  R7C-1   R7C1    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C0
 *  R7C0    R7C2    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C1
 *  R7C1    R7C3    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C2
 *  R7C2    R7C4    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C3
 *  R7C3    R7C5    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C4
 *  R7C4    R7C6    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C5
 *  R7C5    R6C6    diff R  1   1  C -1  -1  Move  R  0 C  0 To R6C6
 * 
 *      65432101234567890123456        65432101234567890123456        65432101234567890123456
 *  -6     H1234321H               -6                             -6                         
 *  -5     123454321               -5                             -5                         
 *  -4     123465432               -4                             -4                         
 *  -3     H1237888887654321H      -3           TTT               -3                         
 *  -2         87654 87654321      -2          T   T              -2                         
 *  -1          8743  8765432      -1         T     T             -1                         
 *   0          8432   876543       0          T     T             0                         
 *   1         84321    87654       1         T       T            1                         
 *   2        S4321H     8765       2        T         T           2        S                
 *   3                  87654       3                 T            3                         
 *   4                 876543       4                T             4                         
 *   5                8765432       5               T              5                         
 *   6               87654321       6              T               6                         
 *   7    H12345678887654321H       7             T                7    H12345678T           
 *   8                              8                              8                         
 * 
 * Direction L Amount 25 
 *  R7C-4   R7C-2   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-3
 *  R7C-3   R7C-1   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-2
 *  R7C-2   R7C0    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-1
 *  R7C-1   R7C1    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C0
 *  R7C0    R7C2    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C1
 *  R7C1    R7C3    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C2
 *  R7C2    R7C4    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C3
 *  R7C3    R7C5    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C4
 *  R7C4    R6C6    diff R  1   1  C -2  -1  Move  R  1 C -1 To R7C5
 * 
 *      65432101234567890123456        65432101234567890123456        65432101234567890123456
 *  -6     H1234321H               -6                             -6                         
 *  -5     123454321               -5                             -5                         
 *  -4     123465432               -4                             -4                         
 *  -3     H1237888887654321H      -3           TTT               -3                         
 *  -2         87654 87654321      -2          T   T              -2                         
 *  -1          8743  8765432      -1         T     T             -1                         
 *   0          8432   876543       0          T     T             0                         
 *   1         84321    87654       1         T       T            1                         
 *   2        S4321H     8765       2        T         T           2        S                
 *   3                  87654       3                 T            3                         
 *   4                 876543       4                T             4                         
 *   5                8765432       5               T              5                         
 *   6               87654321       6              T               6                         
 *   7   H123456788887654321H       7            TT                7   H12345678T            
 *   8                              8                              8                         
 * 
 * Direction L Amount 25 
 *  R7C-5   R7C-3   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-4
 *  R7C-4   R7C-2   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-3
 *  R7C-3   R7C-1   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-2
 *  R7C-2   R7C0    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-1
 *  R7C-1   R7C1    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C0
 *  R7C0    R7C2    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C1
 *  R7C1    R7C3    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C2
 *  R7C2    R7C4    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C3
 *  R7C3    R7C5    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C4
 * 
 *      65432101234567890123456        65432101234567890123456        65432101234567890123456
 *  -6     H1234321H               -6                             -6                         
 *  -5     123454321               -5                             -5                         
 *  -4     123465432               -4                             -4                         
 *  -3     H1237888887654321H      -3           TTT               -3                         
 *  -2         87654 87654321      -2          T   T              -2                         
 *  -1          8743  8765432      -1         T     T             -1                         
 *   0          8432   876543       0          T     T             0                         
 *   1         84321    87654       1         T       T            1                         
 *   2        S4321H     8765       2        T         T           2        S                
 *   3                  87654       3                 T            3                         
 *   4                 876543       4                T             4                         
 *   5                8765432       5               T              5                         
 *   6               87654321       6              T               6                         
 *   7  H1234567888887654321H       7           TTT                7  H12345678T             
 *   8                              8                              8                         
 * 
 * Direction L Amount 25 
 *  R7C-6   R7C-4   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-5
 *  R7C-5   R7C-3   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-4
 *  R7C-4   R7C-2   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-3
 *  R7C-3   R7C-1   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-2
 *  R7C-2   R7C0    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-1
 *  R7C-1   R7C1    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C0
 *  R7C0    R7C2    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C1
 *  R7C1    R7C3    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C2
 *  R7C2    R7C4    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C3
 * 
 *      98765432101234567890123456        98765432101234567890123456        98765432101234567890123456
 *  -6        H1234321H               -6                                -6                            
 *  -5        123454321               -5                                -5                            
 *  -4        123465432               -4                                -4                            
 *  -3        H1237888887654321H      -3              TTT               -3                            
 *  -2            87654 87654321      -2             T   T              -2                            
 *  -1             8743  8765432      -1            T     T             -1                            
 *   0             8432   876543       0             T     T             0                            
 *   1            84321    87654       1            T       T            1                            
 *   2           S4321H     8765       2           T         T           2           S                
 *   3                     87654       3                    T            3                            
 *   4                    876543       4                   T             4                            
 *   5                   8765432       5                  T              5                            
 *   6                  87654321       6                 T               6                            
 *   7    H12345678888887654321H       7             TTTT                7    H12345678T              
 *   8                                 8                                 8                            
 * 
 * Direction L Amount 25 
 *  R7C-7   R7C-5   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-6
 *  R7C-6   R7C-4   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-5
 *  R7C-5   R7C-3   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-4
 *  R7C-4   R7C-2   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-3
 *  R7C-3   R7C-1   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-2
 *  R7C-2   R7C0    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-1
 *  R7C-1   R7C1    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C0
 *  R7C0    R7C2    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C1
 *  R7C1    R7C3    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C2
 * 
 *      98765432101234567890123456        98765432101234567890123456        98765432101234567890123456
 *  -6        H1234321H               -6                                -6                            
 *  -5        123454321               -5                                -5                            
 *  -4        123465432               -4                                -4                            
 *  -3        H1237888887654321H      -3              TTT               -3                            
 *  -2            87654 87654321      -2             T   T              -2                            
 *  -1             8743  8765432      -1            T     T             -1                            
 *   0             8432   876543       0             T     T             0                            
 *   1            84321    87654       1            T       T            1                            
 *   2           S4321H     8765       2           T         T           2           S                
 *   3                     87654       3                    T            3                            
 *   4                    876543       4                   T             4                            
 *   5                   8765432       5                  T              5                            
 *   6                  87654321       6                 T               6                            
 *   7   H123456788888887654321H       7            TTTTT                7   H12345678T               
 *   8                                 8                                 8                            
 * 
 * Direction L Amount 25 
 *  R7C-8   R7C-6   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-7
 *  R7C-7   R7C-5   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-6
 *  R7C-6   R7C-4   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-5
 *  R7C-5   R7C-3   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-4
 *  R7C-4   R7C-2   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-3
 *  R7C-3   R7C-1   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-2
 *  R7C-2   R7C0    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-1
 *  R7C-1   R7C1    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C0
 *  R7C0    R7C2    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C1
 * 
 *      98765432101234567890123456        98765432101234567890123456        98765432101234567890123456
 *  -6        H1234321H               -6                                -6                            
 *  -5        123454321               -5                                -5                            
 *  -4        123465432               -4                                -4                            
 *  -3        H1237888887654321H      -3              TTT               -3                            
 *  -2            87654 87654321      -2             T   T              -2                            
 *  -1             8743  8765432      -1            T     T             -1                            
 *   0             8432   876543       0             T     T             0                            
 *   1            84321    87654       1            T       T            1                            
 *   2           S4321H     8765       2           T         T           2           S                
 *   3                     87654       3                    T            3                            
 *   4                    876543       4                   T             4                            
 *   5                   8765432       5                  T              5                            
 *   6                  87654321       6                 T               6                            
 *   7  H1234567888888887654321H       7           TTTTTT                7  H12345678T                
 *   8                                 8                                 8                            
 * 
 * Direction L Amount 25 
 *  R7C-9   R7C-7   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-8
 *  R7C-8   R7C-6   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-7
 *  R7C-7   R7C-5   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-6
 *  R7C-6   R7C-4   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-5
 *  R7C-5   R7C-3   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-4
 *  R7C-4   R7C-2   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-3
 *  R7C-3   R7C-1   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-2
 *  R7C-2   R7C0    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-1
 *  R7C-1   R7C1    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C0
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 *  -6           H1234321H               -6                                   -6                               
 *  -5           123454321               -5                                   -5                               
 *  -4           123465432               -4                                   -4                               
 *  -3           H1237888887654321H      -3                 TTT               -3                               
 *  -2               87654 87654321      -2                T   T              -2                               
 *  -1                8743  8765432      -1               T     T             -1                               
 *   0                8432   876543       0                T     T             0                               
 *   1               84321    87654       1               T       T            1                               
 *   2              S4321H     8765       2              T         T           2              S                
 *   3                        87654       3                       T            3                               
 *   4                       876543       4                      T             4                               
 *   5                      8765432       5                     T              5                               
 *   6                     87654321       6                    T               6                               
 *   7    H12345678888888887654321H       7             TTTTTTT                7    H12345678T                 
 *   8                                    8                                    8                               
 * 
 * Direction L Amount 25 
 *  R7C-10  R7C-8   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-9
 *  R7C-9   R7C-7   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-8
 *  R7C-8   R7C-6   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-7
 *  R7C-7   R7C-5   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-6
 *  R7C-6   R7C-4   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-5
 *  R7C-5   R7C-3   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-4
 *  R7C-4   R7C-2   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-3
 *  R7C-3   R7C-1   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-2
 *  R7C-2   R7C0    diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-1
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 *  -6           H1234321H               -6                                   -6                               
 *  -5           123454321               -5                                   -5                               
 *  -4           123465432               -4                                   -4                               
 *  -3           H1237888887654321H      -3                 TTT               -3                               
 *  -2               87654 87654321      -2                T   T              -2                               
 *  -1                8743  8765432      -1               T     T             -1                               
 *   0                8432   876543       0                T     T             0                               
 *   1               84321    87654       1               T       T            1                               
 *   2              S4321H     8765       2              T         T           2              S                
 *   3                        87654       3                       T            3                               
 *   4                       876543       4                      T             4                               
 *   5                      8765432       5                     T              5                               
 *   6                     87654321       6                    T               6                               
 *   7   H123456788888888887654321H       7            TTTTTTTT                7   H12345678T                  
 *   8                                    8                                    8                               
 * 
 * Direction L Amount 25 
 *  R7C-11  R7C-9   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-10
 *  R7C-10  R7C-8   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-9
 *  R7C-9   R7C-7   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-8
 *  R7C-8   R7C-6   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-7
 *  R7C-7   R7C-5   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-6
 *  R7C-6   R7C-4   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-5
 *  R7C-5   R7C-3   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-4
 *  R7C-4   R7C-2   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-3
 *  R7C-3   R7C-1   diff R  0   0  C -2  -1  Move  R  0 C -1 To R7C-2
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 *  -6           H1234321H               -6                                   -6                               
 *  -5           123454321               -5                                   -5                               
 *  -4           123465432               -4                                   -4                               
 *  -3           H1237888887654321H      -3                 TTT               -3                               
 *  -2               87654 87654321      -2                T   T              -2                               
 *  -1                8743  8765432      -1               T     T             -1                               
 *   0                8432   876543       0                T     T             0                               
 *   1               84321    87654       1               T       T            1                               
 *   2              S4321H     8765       2              T         T           2              S                
 *   3                        87654       3                       T            3                               
 *   4                       876543       4                      T             4                               
 *   5                      8765432       5                     T              5                               
 *   6   H                 87654321       6                    T               6   H                           
 *   7   H123456788888888887654321H       7            TTTTTTTT                7    12345678T                  
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R6C-11  R7C-10  diff R -1  -1  C -1  -1  Move  R  0 C  0 To R7C-10
 *  R7C-10  R7C-9   diff R  0   0  C -1  -1  Move  R  0 C  0 To R7C-9
 *  R7C-9   R7C-8   diff R  0   0  C -1  -1  Move  R  0 C  0 To R7C-8
 *  R7C-8   R7C-7   diff R  0   0  C -1  -1  Move  R  0 C  0 To R7C-7
 *  R7C-7   R7C-6   diff R  0   0  C -1  -1  Move  R  0 C  0 To R7C-6
 *  R7C-6   R7C-5   diff R  0   0  C -1  -1  Move  R  0 C  0 To R7C-5
 *  R7C-5   R7C-4   diff R  0   0  C -1  -1  Move  R  0 C  0 To R7C-4
 *  R7C-4   R7C-3   diff R  0   0  C -1  -1  Move  R  0 C  0 To R7C-3
 *  R7C-3   R7C-2   diff R  0   0  C -1  -1  Move  R  0 C  0 To R7C-2
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 *  -6           H1234321H               -6                                   -6                               
 *  -5           123454321               -5                                   -5                               
 *  -4           123465432               -4                                   -4                               
 *  -3           H1237888887654321H      -3                 TTT               -3                               
 *  -2               87654 87654321      -2                T   T              -2                               
 *  -1                8743  8765432      -1               T     T             -1                               
 *   0                8432   876543       0                T     T             0                               
 *   1               84321    87654       1               T       T            1                               
 *   2              S4321H     8765       2              T         T           2              S                
 *   3                        87654       3                       T            3                               
 *   4                       876543       4                      T             4                               
 *   5   H                  8765432       5                     T              5   H                           
 *   6   12345678          87654321       6           T        T               6   12345678T                   
 *   7   H123456788888888887654321H       7            TTTTTTTT                7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R5C-11  R7C-10  diff R -2  -1  C -1  -1  Move  R -1 C -1 To R6C-11
 *  R6C-11  R7C-9   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R6C-10
 *  R6C-10  R7C-8   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R6C-9
 *  R6C-9   R7C-7   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R6C-8
 *  R6C-8   R7C-6   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R6C-7
 *  R6C-7   R7C-5   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R6C-6
 *  R6C-6   R7C-4   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R6C-5
 *  R6C-5   R7C-3   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R6C-4
 *  R6C-4   R7C-2   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R6C-3
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 *  -6           H1234321H               -6                                   -6                               
 *  -5           123454321               -5                                   -5                               
 *  -4           123465432               -4                                   -4                               
 *  -3           H1237888887654321H      -3                 TTT               -3                               
 *  -2               87654 87654321      -2                T   T              -2                               
 *  -1                8743  8765432      -1               T     T             -1                               
 *   0                8432   876543       0                T     T             0                               
 *   1               84321    87654       1               T       T            1                               
 *   2              S4321H     8765       2              T         T           2              S                
 *   3                        87654       3                       T            3                               
 *   4   H                   876543       4                      T             4   H                           
 *   5   1                  8765432       5                     T              5   1                           
 *   6   12345678          87654321       6           T        T               6    2345678T                   
 *   7   H123456788888888887654321H       7            TTTTTTTT                7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R4C-11  R6C-11  diff R -2  -1  C  0   0  Move  R -1 C  0 To R5C-11
 *  R5C-11  R6C-10  diff R -1  -1  C -1  -1  Move  R  0 C  0 To R6C-10
 *  R6C-10  R6C-9   diff R  0   0  C -1  -1  Move  R  0 C  0 To R6C-9
 *  R6C-9   R6C-8   diff R  0   0  C -1  -1  Move  R  0 C  0 To R6C-8
 *  R6C-8   R6C-7   diff R  0   0  C -1  -1  Move  R  0 C  0 To R6C-7
 *  R6C-7   R6C-6   diff R  0   0  C -1  -1  Move  R  0 C  0 To R6C-6
 *  R6C-6   R6C-5   diff R  0   0  C -1  -1  Move  R  0 C  0 To R6C-5
 *  R6C-5   R6C-4   diff R  0   0  C -1  -1  Move  R  0 C  0 To R6C-4
 *  R6C-4   R6C-3   diff R  0   0  C -1  -1  Move  R  0 C  0 To R6C-3
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 *  -6           H1234321H               -6                                   -6                               
 *  -5           123454321               -5                                   -5                               
 *  -4           123465432               -4                                   -4                               
 *  -3           H1237888887654321H      -3                 TTT               -3                               
 *  -2               87654 87654321      -2                T   T              -2                               
 *  -1                8743  8765432      -1               T     T             -1                               
 *   0                8432   876543       0                T     T             0                               
 *   1               84321    87654       1               T       T            1                               
 *   2              S4321H     8765       2              T         T           2              S                
 *   3   H                    87654       3                       T            3   H                           
 *   4   1                   876543       4                      T             4   1                           
 *   5   2345678            8765432       5          T          T              5   2345678T                    
 *   6   12345678          87654321       6           T        T               6                               
 *   7   H123456788888888887654321H       7            TTTTTTTT                7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R3C-11  R5C-11  diff R -2  -1  C  0   0  Move  R -1 C  0 To R4C-11
 *  R4C-11  R6C-10  diff R -2  -1  C -1  -1  Move  R -1 C -1 To R5C-11
 *  R5C-11  R6C-9   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R5C-10
 *  R5C-10  R6C-8   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R5C-9
 *  R5C-9   R6C-7   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R5C-8
 *  R5C-8   R6C-6   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R5C-7
 *  R5C-7   R6C-5   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R5C-6
 *  R5C-6   R6C-4   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R5C-5
 *  R5C-5   R6C-3   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R5C-4
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 *  -6           H1234321H               -6                                   -6                               
 *  -5           123454321               -5                                   -5                               
 *  -4           123465432               -4                                   -4                               
 *  -3           H1237888887654321H      -3                 TTT               -3                               
 *  -2               87654 87654321      -2                T   T              -2                               
 *  -1                8743  8765432      -1               T     T             -1                               
 *   0                8432   876543       0                T     T             0                               
 *   1               84321    87654       1               T       T            1                               
 *   2   H          S4321H     8765       2              T         T           2   H          S                
 *   3   1                    87654       3                       T            3   1                           
 *   4   2                   876543       4                      T             4   2                           
 *   5   2345678            8765432       5          T          T              5    345678T                    
 *   6   12345678          87654321       6           T        T               6                               
 *   7   H123456788888888887654321H       7            TTTTTTTT                7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R2C-11  R4C-11  diff R -2  -1  C  0   0  Move  R -1 C  0 To R3C-11
 *  R3C-11  R5C-11  diff R -2  -1  C  0   0  Move  R -1 C  0 To R4C-11
 *  R4C-11  R5C-10  diff R -1  -1  C -1  -1  Move  R  0 C  0 To R5C-10
 *  R5C-10  R5C-9   diff R  0   0  C -1  -1  Move  R  0 C  0 To R5C-9
 *  R5C-9   R5C-8   diff R  0   0  C -1  -1  Move  R  0 C  0 To R5C-8
 *  R5C-8   R5C-7   diff R  0   0  C -1  -1  Move  R  0 C  0 To R5C-7
 *  R5C-7   R5C-6   diff R  0   0  C -1  -1  Move  R  0 C  0 To R5C-6
 *  R5C-6   R5C-5   diff R  0   0  C -1  -1  Move  R  0 C  0 To R5C-5
 *  R5C-5   R5C-4   diff R  0   0  C -1  -1  Move  R  0 C  0 To R5C-4
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 *  -6           H1234321H               -6                                   -6                               
 *  -5           123454321               -5                                   -5                               
 *  -4           123465432               -4                                   -4                               
 *  -3           H1237888887654321H      -3                 TTT               -3                               
 *  -2               87654 87654321      -2                T   T              -2                               
 *  -1                8743  8765432      -1               T     T             -1                               
 *   0                8432   876543       0                T     T             0                               
 *   1   H           84321    87654       1               T       T            1   H                           
 *   2   1          S4321H     8765       2              T         T           2   1          S                
 *   3   2                    87654       3                       T            3   2                           
 *   4   345678              876543       4         T            T             4   345678T                     
 *   5   2345678            8765432       5          T          T              5                               
 *   6   12345678          87654321       6           T        T               6                               
 *   7   H123456788888888887654321H       7            TTTTTTTT                7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R1C-11  R3C-11  diff R -2  -1  C  0   0  Move  R -1 C  0 To R2C-11
 *  R2C-11  R4C-11  diff R -2  -1  C  0   0  Move  R -1 C  0 To R3C-11
 *  R3C-11  R5C-10  diff R -2  -1  C -1  -1  Move  R -1 C -1 To R4C-11
 *  R4C-11  R5C-9   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R4C-10
 *  R4C-10  R5C-8   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R4C-9
 *  R4C-9   R5C-7   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R4C-8
 *  R4C-8   R5C-6   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R4C-7
 *  R4C-7   R5C-5   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R4C-6
 *  R4C-6   R5C-4   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R4C-5
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 *  -6           H1234321H               -6                                   -6                               
 *  -5           123454321               -5                                   -5                               
 *  -4           123465432               -4                                   -4                               
 *  -3           H1237888887654321H      -3                 TTT               -3                               
 *  -2               87654 87654321      -2                T   T              -2                               
 *  -1                8743  8765432      -1               T     T             -1                               
 *   0   H            8432   876543       0                T     T             0   H                           
 *   1   1           84321    87654       1               T       T            1   1                           
 *   2   2          S4321H     8765       2              T         T           2   2          S                
 *   3   3                    87654       3                       T            3   3                           
 *   4   345678              876543       4         T            T             4    45678T                     
 *   5   2345678            8765432       5          T          T              5                               
 *   6   12345678          87654321       6           T        T               6                               
 *   7   H123456788888888887654321H       7            TTTTTTTT                7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R0C-11  R2C-11  diff R -2  -1  C  0   0  Move  R -1 C  0 To R1C-11
 *  R1C-11  R3C-11  diff R -2  -1  C  0   0  Move  R -1 C  0 To R2C-11
 *  R2C-11  R4C-11  diff R -2  -1  C  0   0  Move  R -1 C  0 To R3C-11
 *  R3C-11  R4C-10  diff R -1  -1  C -1  -1  Move  R  0 C  0 To R4C-10
 *  R4C-10  R4C-9   diff R  0   0  C -1  -1  Move  R  0 C  0 To R4C-9
 *  R4C-9   R4C-8   diff R  0   0  C -1  -1  Move  R  0 C  0 To R4C-8
 *  R4C-8   R4C-7   diff R  0   0  C -1  -1  Move  R  0 C  0 To R4C-7
 *  R4C-7   R4C-6   diff R  0   0  C -1  -1  Move  R  0 C  0 To R4C-6
 *  R4C-6   R4C-5   diff R  0   0  C -1  -1  Move  R  0 C  0 To R4C-5
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 *  -6           H1234321H               -6                                   -6                               
 *  -5           123454321               -5                                   -5                               
 *  -4           123465432               -4                                   -4                               
 *  -3           H1237888887654321H      -3                 TTT               -3                               
 *  -2               87654 87654321      -2                T   T              -2                               
 *  -1   H            8743  8765432      -1               T     T             -1   H                           
 *   0   1            8432   876543       0                T     T             0   1                           
 *   1   2           84321    87654       1               T       T            1   2                           
 *   2   3          S4321H     8765       2              T         T           2   3          S                
 *   3   45678                87654       3        T              T            3   45678T                      
 *   4   345678              876543       4         T            T             4                               
 *   5   2345678            8765432       5          T          T              5                               
 *   6   12345678          87654321       6           T        T               6                               
 *   7   H123456788888888887654321H       7            TTTTTTTT                7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R-1C-11 R1C-11  diff R -2  -1  C  0   0  Move  R -1 C  0 To R0C-11
 *  R0C-11  R2C-11  diff R -2  -1  C  0   0  Move  R -1 C  0 To R1C-11
 *  R1C-11  R3C-11  diff R -2  -1  C  0   0  Move  R -1 C  0 To R2C-11
 *  R2C-11  R4C-10  diff R -2  -1  C -1  -1  Move  R -1 C -1 To R3C-11
 *  R3C-11  R4C-9   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R3C-10
 *  R3C-10  R4C-8   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R3C-9
 *  R3C-9   R4C-7   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R3C-8
 *  R3C-8   R4C-6   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R3C-7
 *  R3C-7   R4C-5   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R3C-6
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 *  -6           H1234321H               -6                                   -6                               
 *  -5           123454321               -5                                   -5                               
 *  -4           123465432               -4                                   -4                               
 *  -3           H1237888887654321H      -3                 TTT               -3                               
 *  -2   H           87654 87654321      -2                T   T              -2   H                           
 *  -1   1            8743  8765432      -1               T     T             -1   1                           
 *   0   2            8432   876543       0                T     T             0   2                           
 *   1   3           84321    87654       1               T       T            1   3                           
 *   2   4          S4321H     8765       2              T         T           2   4          S                
 *   3   45678                87654       3        T              T            3    5678T                      
 *   4   345678              876543       4         T            T             4                               
 *   5   2345678            8765432       5          T          T              5                               
 *   6   12345678          87654321       6           T        T               6                               
 *   7   H123456788888888887654321H       7            TTTTTTTT                7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R-2C-11 R0C-11  diff R -2  -1  C  0   0  Move  R -1 C  0 To R-1C-11
 *  R-1C-11 R1C-11  diff R -2  -1  C  0   0  Move  R -1 C  0 To R0C-11
 *  R0C-11  R2C-11  diff R -2  -1  C  0   0  Move  R -1 C  0 To R1C-11
 *  R1C-11  R3C-11  diff R -2  -1  C  0   0  Move  R -1 C  0 To R2C-11
 *  R2C-11  R3C-10  diff R -1  -1  C -1  -1  Move  R  0 C  0 To R3C-10
 *  R3C-10  R3C-9   diff R  0   0  C -1  -1  Move  R  0 C  0 To R3C-9
 *  R3C-9   R3C-8   diff R  0   0  C -1  -1  Move  R  0 C  0 To R3C-8
 *  R3C-8   R3C-7   diff R  0   0  C -1  -1  Move  R  0 C  0 To R3C-7
 *  R3C-7   R3C-6   diff R  0   0  C -1  -1  Move  R  0 C  0 To R3C-6
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 *  -6           H1234321H               -6                                   -6                               
 *  -5           123454321               -5                                   -5                               
 *  -4           123465432               -4                                   -4                               
 *  -3   H       H1237888887654321H      -3                 TTT               -3   H                           
 *  -2   1           87654 87654321      -2                T   T              -2   1                           
 *  -1   2            8743  8765432      -1               T     T             -1   2                           
 *   0   3            8432   876543       0                T     T             0   3                           
 *   1   4           84321    87654       1               T       T            1   4                           
 *   2   5678       S4321H     8765       2       T      T         T           2   5678T      S                
 *   3   45678                87654       3        T              T            3                               
 *   4   345678              876543       4         T            T             4                               
 *   5   2345678            8765432       5          T          T              5                               
 *   6   12345678          87654321       6           T        T               6                               
 *   7   H123456788888888887654321H       7            TTTTTTTT                7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R-3C-11 R-1C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-2C-11
 *  R-2C-11 R0C-11  diff R -2  -1  C  0   0  Move  R -1 C  0 To R-1C-11
 *  R-1C-11 R1C-11  diff R -2  -1  C  0   0  Move  R -1 C  0 To R0C-11
 *  R0C-11  R2C-11  diff R -2  -1  C  0   0  Move  R -1 C  0 To R1C-11
 *  R1C-11  R3C-10  diff R -2  -1  C -1  -1  Move  R -1 C -1 To R2C-11
 *  R2C-11  R3C-9   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R2C-10
 *  R2C-10  R3C-8   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R2C-9
 *  R2C-9   R3C-7   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R2C-8
 *  R2C-8   R3C-6   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R2C-7
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 *  -6           H1234321H               -6                                   -6                               
 *  -5           123454321               -5                                   -5                               
 *  -4   H       123465432               -4                                   -4   H                           
 *  -3   1       H1237888887654321H      -3                 TTT               -3   1                           
 *  -2   2           87654 87654321      -2                T   T              -2   2                           
 *  -1   3            8743  8765432      -1               T     T             -1   3                           
 *   0   4            8432   876543       0                T     T             0   4                           
 *   1   5           84321    87654       1               T       T            1   5                           
 *   2   5678       S4321H     8765       2       T      T         T           2    678T      S                
 *   3   45678                87654       3        T              T            3                               
 *   4   345678              876543       4         T            T             4                               
 *   5   2345678            8765432       5          T          T              5                               
 *   6   12345678          87654321       6           T        T               6                               
 *   7   H123456788888888887654321H       7            TTTTTTTT                7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R-4C-11 R-2C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-3C-11
 *  R-3C-11 R-1C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-2C-11
 *  R-2C-11 R0C-11  diff R -2  -1  C  0   0  Move  R -1 C  0 To R-1C-11
 *  R-1C-11 R1C-11  diff R -2  -1  C  0   0  Move  R -1 C  0 To R0C-11
 *  R0C-11  R2C-11  diff R -2  -1  C  0   0  Move  R -1 C  0 To R1C-11
 *  R1C-11  R2C-10  diff R -1  -1  C -1  -1  Move  R  0 C  0 To R2C-10
 *  R2C-10  R2C-9   diff R  0   0  C -1  -1  Move  R  0 C  0 To R2C-9
 *  R2C-9   R2C-8   diff R  0   0  C -1  -1  Move  R  0 C  0 To R2C-8
 *  R2C-8   R2C-7   diff R  0   0  C -1  -1  Move  R  0 C  0 To R2C-7
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 *  -6           H1234321H               -6                                   -6                               
 *  -5   H       123454321               -5                                   -5   H                           
 *  -4   1       123465432               -4                                   -4   1                           
 *  -3   2       H1237888887654321H      -3                 TTT               -3   2                           
 *  -2   3           87654 87654321      -2                T   T              -2   3                           
 *  -1   4            8743  8765432      -1               T     T             -1   4                           
 *   0   5            8432   876543       0                T     T             0   5                           
 *   1   678         84321    87654       1      T        T       T            1   678T                        
 *   2   5678       S4321H     8765       2       T      T         T           2              S                
 *   3   45678                87654       3        T              T            3                               
 *   4   345678              876543       4         T            T             4                               
 *   5   2345678            8765432       5          T          T              5                               
 *   6   12345678          87654321       6           T        T               6                               
 *   7   H123456788888888887654321H       7            TTTTTTTT                7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R-5C-11 R-3C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-4C-11
 *  R-4C-11 R-2C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-3C-11
 *  R-3C-11 R-1C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-2C-11
 *  R-2C-11 R0C-11  diff R -2  -1  C  0   0  Move  R -1 C  0 To R-1C-11
 *  R-1C-11 R1C-11  diff R -2  -1  C  0   0  Move  R -1 C  0 To R0C-11
 *  R0C-11  R2C-10  diff R -2  -1  C -1  -1  Move  R -1 C -1 To R1C-11
 *  R1C-11  R2C-9   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R1C-10
 *  R1C-10  R2C-8   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R1C-9
 *  R1C-9   R2C-7   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R1C-8
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 *  -6   H       H1234321H               -6                                   -6   H                           
 *  -5   1       123454321               -5                                   -5   1                           
 *  -4   2       123465432               -4                                   -4   2                           
 *  -3   3       H1237888887654321H      -3                 TTT               -3   3                           
 *  -2   4           87654 87654321      -2                T   T              -2   4                           
 *  -1   5            8743  8765432      -1               T     T             -1   5                           
 *   0   6            8432   876543       0                T     T             0   6                           
 *   1   678         84321    87654       1      T        T       T            1    78T                        
 *   2   5678       S4321H     8765       2       T      T         T           2              S                
 *   3   45678                87654       3        T              T            3                               
 *   4   345678              876543       4         T            T             4                               
 *   5   2345678            8765432       5          T          T              5                               
 *   6   12345678          87654321       6           T        T               6                               
 *   7   H123456788888888887654321H       7            TTTTTTTT                7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R-6C-11 R-4C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-5C-11
 *  R-5C-11 R-3C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-4C-11
 *  R-4C-11 R-2C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-3C-11
 *  R-3C-11 R-1C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-2C-11
 *  R-2C-11 R0C-11  diff R -2  -1  C  0   0  Move  R -1 C  0 To R-1C-11
 *  R-1C-11 R1C-11  diff R -2  -1  C  0   0  Move  R -1 C  0 To R0C-11
 *  R0C-11  R1C-10  diff R -1  -1  C -1  -1  Move  R  0 C  0 To R1C-10
 *  R1C-10  R1C-9   diff R  0   0  C -1  -1  Move  R  0 C  0 To R1C-9
 *  R1C-9   R1C-8   diff R  0   0  C -1  -1  Move  R  0 C  0 To R1C-8
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 *  -9                                   -9                                   -9                               
 *  -8                                   -8                                   -8                               
 *  -7   H                               -7                                   -7   H                           
 *  -6   1       H1234321H               -6                                   -6   1                           
 *  -5   2       123454321               -5                                   -5   2                           
 *  -4   3       123465432               -4                                   -4   3                           
 *  -3   4       H1237888887654321H      -3                 TTT               -3   4                           
 *  -2   5           87654 87654321      -2                T   T              -2   5                           
 *  -1   6            8743  8765432      -1               T     T             -1   6                           
 *   0   78           8432   876543       0     T          T     T             0   78T                         
 *   1   678         84321    87654       1      T        T       T            1                               
 *   2   5678       S4321H     8765       2       T      T         T           2              S                
 *   3   45678                87654       3        T              T            3                               
 *   4   345678              876543       4         T            T             4                               
 *   5   2345678            8765432       5          T          T              5                               
 *   6   12345678          87654321       6           T        T               6                               
 *   7   H123456788888888887654321H       7            TTTTTTTT                7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R-7C-11 R-5C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-6C-11
 *  R-6C-11 R-4C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-5C-11
 *  R-5C-11 R-3C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-4C-11
 *  R-4C-11 R-2C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-3C-11
 *  R-3C-11 R-1C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-2C-11
 *  R-2C-11 R0C-11  diff R -2  -1  C  0   0  Move  R -1 C  0 To R-1C-11
 *  R-1C-11 R1C-10  diff R -2  -1  C -1  -1  Move  R -1 C -1 To R0C-11
 *  R0C-11  R1C-9   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R0C-10
 *  R0C-10  R1C-8   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R0C-9
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 *  -9                                   -9                                   -9                               
 *  -8   H                               -8                                   -8   H                           
 *  -7   1                               -7                                   -7   1                           
 *  -6   2       H1234321H               -6                                   -6   2                           
 *  -5   3       123454321               -5                                   -5   3                           
 *  -4   4       123465432               -4                                   -4   4                           
 *  -3   5       H1237888887654321H      -3                 TTT               -3   5                           
 *  -2   6           87654 87654321      -2                T   T              -2   6                           
 *  -1   7            8743  8765432      -1               T     T             -1   7                           
 *   0   78           8432   876543       0     T          T     T             0    8T                         
 *   1   678         84321    87654       1      T        T       T            1                               
 *   2   5678       S4321H     8765       2       T      T         T           2              S                
 *   3   45678                87654       3        T              T            3                               
 *   4   345678              876543       4         T            T             4                               
 *   5   2345678            8765432       5          T          T              5                               
 *   6   12345678          87654321       6           T        T               6                               
 *   7   H123456788888888887654321H       7            TTTTTTTT                7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R-8C-11 R-6C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-7C-11
 *  R-7C-11 R-5C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-6C-11
 *  R-6C-11 R-4C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-5C-11
 *  R-5C-11 R-3C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-4C-11
 *  R-4C-11 R-2C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-3C-11
 *  R-3C-11 R-1C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-2C-11
 *  R-2C-11 R0C-11  diff R -2  -1  C  0   0  Move  R -1 C  0 To R-1C-11
 *  R-1C-11 R0C-10  diff R -1  -1  C -1  -1  Move  R  0 C  0 To R0C-10
 *  R0C-10  R0C-9   diff R  0   0  C -1  -1  Move  R  0 C  0 To R0C-9
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 *  -9   H                               -9                                   -9   H                           
 *  -8   1                               -8                                   -8   1                           
 *  -7   2                               -7                                   -7   2                           
 *  -6   3       H1234321H               -6                                   -6   3                           
 *  -5   4       123454321               -5                                   -5   4                           
 *  -4   5       123465432               -4                                   -4   5                           
 *  -3   6       H1237888887654321H      -3                 TTT               -3   6                           
 *  -2   7           87654 87654321      -2                T   T              -2   7                           
 *  -1   8            8743  8765432      -1    T          T     T             -1   8T                          
 *   0   78           8432   876543       0     T          T     T             0                               
 *   1   678         84321    87654       1      T        T       T            1                               
 *   2   5678       S4321H     8765       2       T      T         T           2              S                
 *   3   45678                87654       3        T              T            3                               
 *   4   345678              876543       4         T            T             4                               
 *   5   2345678            8765432       5          T          T              5                               
 *   6   12345678          87654321       6           T        T               6                               
 *   7   H123456788888888887654321H       7            TTTTTTTT                7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R-9C-11 R-7C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-8C-11
 *  R-8C-11 R-6C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-7C-11
 *  R-7C-11 R-5C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-6C-11
 *  R-6C-11 R-4C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-5C-11
 *  R-5C-11 R-3C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-4C-11
 *  R-4C-11 R-2C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-3C-11
 *  R-3C-11 R-1C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-2C-11
 *  R-2C-11 R0C-10  diff R -2  -1  C -1  -1  Move  R -1 C -1 To R-1C-11
 *  R-1C-11 R0C-9   diff R -1  -1  C -2  -1  Move  R -1 C -1 To R-1C-10
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 * -12                                  -12                                  -12                               
 * -11                                  -11                                  -11                               
 * -10   H                              -10                                  -10   H                           
 *  -9   1                               -9                                   -9   1                           
 *  -8   2                               -8                                   -8   2                           
 *  -7   3                               -7                                   -7   3                           
 *  -6   4       H1234321H               -6                                   -6   4                           
 *  -5   5       123454321               -5                                   -5   5                           
 *  -4   6       123465432               -4                                   -4   6                           
 *  -3   7       H1237888887654321H      -3                 TTT               -3   7                           
 *  -2   8           87654 87654321      -2                T   T              -2   8                           
 *  -1   8            8743  8765432      -1    T          T     T             -1    T                          
 *   0   78           8432   876543       0     T          T     T             0                               
 *   1   678         84321    87654       1      T        T       T            1                               
 *   2   5678       S4321H     8765       2       T      T         T           2              S                
 *   3   45678                87654       3        T              T            3                               
 *   4   345678              876543       4         T            T             4                               
 *   5   2345678            8765432       5          T          T              5                               
 *   6   12345678          87654321       6           T        T               6                               
 *   7   H123456788888888887654321H       7            TTTTTTTT                7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R-10C-11 R-8C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-9C-11
 *  R-9C-11 R-7C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-8C-11
 *  R-8C-11 R-6C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-7C-11
 *  R-7C-11 R-5C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-6C-11
 *  R-6C-11 R-4C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-5C-11
 *  R-5C-11 R-3C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-4C-11
 *  R-4C-11 R-2C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-3C-11
 *  R-3C-11 R-1C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-2C-11
 *  R-2C-11 R-1C-10 diff R -1  -1  C -1  -1  Move  R  0 C  0 To R-1C-10
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 * -12                                  -12                                  -12                               
 * -11   H                              -11                                  -11   H                           
 * -10   1                              -10                                  -10   1                           
 *  -9   2                               -9                                   -9   2                           
 *  -8   3                               -8                                   -8   3                           
 *  -7   4                               -7                                   -7   4                           
 *  -6   5       H1234321H               -6                                   -6   5                           
 *  -5   6       123454321               -5                                   -5   6                           
 *  -4   7       123465432               -4                                   -4   7                           
 *  -3   8       H1237888887654321H      -3                 TTT               -3   8                           
 *  -2   8           87654 87654321      -2   T            T   T              -2   T                           
 *  -1   8            8743  8765432      -1    T          T     T             -1                               
 *   0   78           8432   876543       0     T          T     T             0                               
 *   1   678         84321    87654       1      T        T       T            1                               
 *   2   5678       S4321H     8765       2       T      T         T           2              S                
 *   3   45678                87654       3        T              T            3                               
 *   4   345678              876543       4         T            T             4                               
 *   5   2345678            8765432       5          T          T              5                               
 *   6   12345678          87654321       6           T        T               6                               
 *   7   H123456788888888887654321H       7            TTTTTTTT                7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R-11C-11 R-9C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-10C-11
 *  R-10C-11 R-8C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-9C-11
 *  R-9C-11 R-7C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-8C-11
 *  R-8C-11 R-6C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-7C-11
 *  R-7C-11 R-5C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-6C-11
 *  R-6C-11 R-4C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-5C-11
 *  R-5C-11 R-3C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-4C-11
 *  R-4C-11 R-2C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-3C-11
 *  R-3C-11 R-1C-10 diff R -2  -1  C -1  -1  Move  R -1 C -1 To R-2C-11
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 * -12   H                              -12                                  -12   H                           
 * -11   1                              -11                                  -11   1                           
 * -10   2                              -10                                  -10   2                           
 *  -9   3                               -9                                   -9   3                           
 *  -8   4                               -8                                   -8   4                           
 *  -7   5                               -7                                   -7   5                           
 *  -6   6       H1234321H               -6                                   -6   6                           
 *  -5   7       123454321               -5                                   -5   7                           
 *  -4   8       123465432               -4                                   -4   8                           
 *  -3   8       H1237888887654321H      -3   T             TTT               -3   T                           
 *  -2   8           87654 87654321      -2   T            T   T              -2                               
 *  -1   8            8743  8765432      -1    T          T     T             -1                               
 *   0   78           8432   876543       0     T          T     T             0                               
 *   1   678         84321    87654       1      T        T       T            1                               
 *   2   5678       S4321H     8765       2       T      T         T           2              S                
 *   3   45678                87654       3        T              T            3                               
 *   4   345678              876543       4         T            T             4                               
 *   5   2345678            8765432       5          T          T              5                               
 *   6   12345678          87654321       6           T        T               6                               
 *   7   H123456788888888887654321H       7            TTTTTTTT                7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R-12C-11 R-10C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-11C-11
 *  R-11C-11 R-9C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-10C-11
 *  R-10C-11 R-8C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-9C-11
 *  R-9C-11 R-7C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-8C-11
 *  R-8C-11 R-6C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-7C-11
 *  R-7C-11 R-5C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-6C-11
 *  R-6C-11 R-4C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-5C-11
 *  R-5C-11 R-3C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-4C-11
 *  R-4C-11 R-2C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-3C-11
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 * -15                                  -15                                  -15                               
 * -14                                  -14                                  -14                               
 * -13   H                              -13                                  -13   H                           
 * -12   1                              -12                                  -12   1                           
 * -11   2                              -11                                  -11   2                           
 * -10   3                              -10                                  -10   3                           
 *  -9   4                               -9                                   -9   4                           
 *  -8   5                               -8                                   -8   5                           
 *  -7   6                               -7                                   -7   6                           
 *  -6   7       H1234321H               -6                                   -6   7                           
 *  -5   8       123454321               -5                                   -5   8                           
 *  -4   8       123465432               -4   T                               -4   T                           
 *  -3   8       H1237888887654321H      -3   T             TTT               -3                               
 *  -2   8           87654 87654321      -2   T            T   T              -2                               
 *  -1   8            8743  8765432      -1    T          T     T             -1                               
 *   0   78           8432   876543       0     T          T     T             0                               
 *   1   678         84321    87654       1      T        T       T            1                               
 *   2   5678       S4321H     8765       2       T      T         T           2              S                
 *   3   45678                87654       3        T              T            3                               
 *   4   345678              876543       4         T            T             4                               
 *   5   2345678            8765432       5          T          T              5                               
 *   6   12345678          87654321       6           T        T               6                               
 *   7   H123456788888888887654321H       7            TTTTTTTT                7                               
 *   8                                    8                                    8                               
 * 
 * Direction U Amount 20 
 *  R-13C-11 R-11C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-12C-11
 *  R-12C-11 R-10C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-11C-11
 *  R-11C-11 R-9C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-10C-11
 *  R-10C-11 R-8C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-9C-11
 *  R-9C-11 R-7C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-8C-11
 *  R-8C-11 R-6C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-7C-11
 *  R-7C-11 R-5C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-6C-11
 *  R-6C-11 R-4C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-5C-11
 *  R-5C-11 R-3C-11 diff R -2  -1  C  0   0  Move  R -1 C  0 To R-4C-11
 * 
 * 
 * 
 *      21098765432101234567890123456        21098765432101234567890123456        21098765432101234567890123456
 * -15                                  -15                                  -15                               
 * -14                                  -14                                  -14                               
 * -13   H                              -13                                  -13   H                           
 * -12   H                              -12   T                              -12   T                           
 * -11   H                              -11   T                              -11                               
 * -10   H                              -10   T                              -10                               
 *  -9   H                               -9   T                               -9                               
 *  -8   H                               -8   T                               -8                               
 *  -7   H                               -7   T                               -7                               
 *  -6   H       HHHHHHHHH               -6   T        TTTTTTT                -6                               
 *  -5   H       H       H               -5   T       T       T               -5                               
 *  -4   H       H       H               -4   T       T       T               -4                               
 *  -3   H       HHHHHHHHHHHHHHHHHH      -3   T        TTTTTTTTTTTTTTTT       -3                               
 *  -2   H               H        H      -2   T               T        T      -2                               
 *  -1   H               H        H      -1   T               T        T      -1                               
 *   0   H               H        H       0   T               T        T       0                               
 *   1   H               H        H       1   T               T        T       1                               
 *   2   H          SHHHHH        H       2   T          TTTTT         T       2              S                
 *   3   H                        H       3   T                        T       3                               
 *   4   H                        H       4   T                        T       4                               
 *   5   H                        H       5   T                        T       5                               
 *   6   H                        H       6   T                        T       6                               
 *   7   HHHHHHHHHHHHHHHHHHHHHHHHHH       7    TTTTTTTTTTTTTTTTTTTTTTTT        7                               
 *   8                                    8                                    8                               
 * 
 * 
 * Result Part 1 = 88
 * Result Part 2 = 36
 * 
 * 
 */
