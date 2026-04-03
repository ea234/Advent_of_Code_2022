import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2022/day/22
 * 
 * https://www.reddit.com/r/adventofcode/comments/zsct8w/2022_day_22_solutions/
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day22/day_22__Monkey_Map.js
 * 
 * Day22 - Monkey Map
 * 
 * 10R5L5R10L4R5L5
 * Direction From Right To Down  Rotation R  Move Count    10
 * Direction From Down  To Right Rotation L  Move Count     5
 * Direction From Right To Down  Rotation R  Move Count     5
 * Direction From Down  To Right Rotation L  Move Count    10
 * Direction From Right To Down  Rotation R  Move Count     4
 * Direction From Down  To Right Rotation L  Move Count     5
 * Direction From Right To Right Rotation E  Move Count     5
 * 
 *      0123456789012345          0123456789012345          0123456789012345
 *   0          ...#           0          >>v            0          >>v#
 *   1          .#..           1            v            1          .#v.
 *   2          #...           2            v            2          #.v.
 *   3          ....           3            v            3          ..v.
 *   4  ...#.......#           4         v  v            4  ...#...v..v#
 *   5  ........#...           5  >>>v   >  >>           5  >>>v...>#.>>
 *   6  ..#....#....           6     v                   6  ..#v...#....
 *   7  ..........#.           7     >>>>v               7  ...>>>>v..#.
 *   8          ...#....       8                         8          ...#....
 *   9          .....#..       9                         9          .....#..
 *  10          .#......      10                        10          .#......
 *  11          ......#.      11                        11          ......#.
 * 
 * Result
 * Row 6     * 1000 =   6000
 * Col 8     *    4 =     32
 * Dir Right        =      0
 * 
 * Result Part 1 = 6032
 * Result Part 2 = 0
 * 
 * Day 22 - Ende
 * 
 * ----------------------------------------------------------------------------
 * 
 * Result
 * Row 64    * 1000 =  64000
 * Col 64    *    4 =    256
 * Dir Right        =      0
 * 
 * Result Part 1 = 64256
 * Result Part 2 = 0
 * 
 */

const CHAR_MAP_UP        : string = "^";
const CHAR_MAP_DOWN      : string = "v";
const CHAR_MAP_LEFT      : string = "<";
const CHAR_MAP_RIGHT     : string = ">";
const CHAR_NO_MAP        : string = " ";
const CHAR_MAP_OPEN_TILE : string = ".";
const CHAR_MAP_WALL      : string = "#"; 

const DIRECTION_RIGHT    : string = "Right";
const DIRECTION_LEFT     : string = "Left";
const DIRECTION_UP       : string = "Up";
const DIRECTION_DOWN     : string = "Down";

const ROTATE_LEFT        : string = "L";
const ROTATE_RIGHT       : string = "R";
const END_MOVE_PATH      : string = "E";

const VALUE_RIGHT        : number = 0;
const VALUE_DOWN         : number = 1;
const VALUE_LEFT         : number = 2;
const VALUE_UP           : number = 3;

const STR_COMBINE_SPACER : string = "     "; 

type Coords = { col : number, row : number };

type PropCoords = Record< string, Coords >;

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


function getNewDirection( pDirection : string, pRotate : string ) : string
{
    if ( pRotate === ROTATE_LEFT )
    {
        if( pDirection === DIRECTION_RIGHT ) return DIRECTION_UP;
        if( pDirection === DIRECTION_UP    ) return DIRECTION_LEFT;
        if( pDirection === DIRECTION_LEFT  ) return DIRECTION_DOWN;
        //if( pOldDirection === DIRECTION_DOWN )  return DIRECTION_RIGHT;
    }
    else if ( pRotate === ROTATE_RIGHT )
    {
        if( pDirection === DIRECTION_RIGHT ) return DIRECTION_DOWN;
        if( pDirection === DIRECTION_DOWN  ) return DIRECTION_LEFT;
        if( pDirection === DIRECTION_LEFT  ) return DIRECTION_UP;
        //if( pOldDirection === DIRECTION_UP    ) return DIRECTION_RIGHT;
    }

    return DIRECTION_RIGHT;
}


function getDirectionValue( pDirection : string ) : number 
{
    if( pDirection === DIRECTION_UP   ) return VALUE_UP;
    if( pDirection === DIRECTION_LEFT ) return VALUE_LEFT;
    if( pDirection === DIRECTION_DOWN ) return VALUE_DOWN;

    return VALUE_RIGHT;
}


class MonkeyMap
{
    cur_row       : number = 0;
    cur_col       : number = 0;

    grid_rows     : number = 0;
    grid_cols     : number = 0;

    move_map      : PropertieMap = {};

    map_input_str : PropertieMap = {};

    wrap_positons : PropCoords   = {};

    constructor()
    {
    }

    public reset()
    {
        this.cur_col = 0;
        this.cur_row = 0;

        this.move_map = {};

        this.wrap_positons = {}
    }

    public determineStartPosition() : void 
    {
        this.cur_col = this.findNewStartLeft( this.cur_row );
    }

    public determineWrapPositionsPart1() : void 
    {
        /*
         * Line Wrap Row Positions 
         */
        for ( let cur_row1 = 0; cur_row1 < this.grid_rows; cur_row1++ )
        {
            let cur_col_start = this.findNewStartLeft( cur_row1 );
            let cur_col_end   = this.findEndToRight( cur_row1, cur_col_start );

            this.wrap_positons[ "R" + cur_row1 + "C" + ( cur_col_start - 1 ) ] = { row : cur_row1, col : cur_col_end   };
            this.wrap_positons[ "R" + cur_row1 + "C" + ( cur_col_end   + 1 ) ] = { row : cur_row1, col : cur_col_start };
        }

        /*
         * Line Wrap Col Positions 
         */
        for ( let cur_col1 = 0; cur_col1 < this.grid_rows; cur_col1++ )
        {
            let cur_row_start = this.findNewStartToBottom( cur_col1 );
            let cur_row_end   = this.findEndToBottom( cur_row_start, cur_col1 );

            this.wrap_positons[ "R" + ( cur_row_start - 1 ) + "C" + cur_col1 ] = { row : cur_row_end,   col : cur_col1 };
            this.wrap_positons[ "R" + ( cur_row_end   + 1 ) + "C" + cur_col1 ] = { row : cur_row_start, col : cur_col1 };
        }
    }



    public determineWrapPositionsPart2( pSquareWidth : number ) : void 
    {
/*
          HIJK
          G111
          F111
          E111

VWXY DCBA 4444
2222 3333 4444
2222 3333 4444
2222 3333 4444

          5555 6666
          5555 6666
          5555 6666
          5555 6666

top    row square 3 - wraps to left col square 1
bottom row square 3 - wraps to left col square 5

top    row square 2 - wraps to top    row square 1
bottom row square 2 - wraps to bottom row square 5
bottom row square 6 - wraps to left col square 2 

top    row square 6 - wraps to right col square 4
right  col square 6 - wraps to right col square 1

left col square 2 - wraps to 

1 rc 6 rc

*/


    // let pSquare1Col1 : number = 0;

    // for ( let cur_step : number = 0; cur_step < pSquareWidth; cur_step++ )
    // {
    //     let square_1_col : number = pSquare1Col1 + cur_step;

    //     let square_2_row : number = pSquare2Row + cur_step

    // }

    let square_width : number = pSquareWidth;



    let square_2_top_row    : number = square_width;
    let square_2_left_col   : number = 0;

    let square_2_bottom_row : number = square_2_top_row + square_width;
    let square_2_right_col  : number = square_2_left_col + square_width;

    let square_3_top_row    : number = square_2_top_row;
    let square_3_left_col   : number = square_2_right_col + 1;

    let square_3_bottom_row : number = square_3_top_row + square_width;
    let square_3_right_col  : number = square_3_left_col + square_width;

    let square_4_top_row    : number = square_3_top_row;
    let square_4_left_col   : number = square_3_right_col + 1;

    let square_4_bottom_row : number = square_4_top_row + square_width;
    let square_4_right_col  : number = square_4_left_col + square_width;

    let square_5_top_row    : number = square_4_bottom_row + 1;
    let square_5_left_col   : number = square_4_left_col;

    let square_5_bottom_row : number = square_5_top_row + square_width;
    let square_5_right_col  : number = square_5_left_col + square_width;

    let square_6_top_row    : number = square_5_top_row;
    let square_6_left_col   : number = square_5_right_col + 1;

    let square_6_bottom_row : number = square_6_top_row + square_width;
    let square_6_right_col  : number = square_6_left_col + square_width;

    let square_1_bottom_row : number = square_4_top_row - 1;
    let square_1_left_col   : number = square_4_left_col;

    let square_1_top_row    : number = square_1_bottom_row - ( square_width - 1);
    let square_1_right_col  : number = square_1_left_col + square_width;

        /*
         * Line Wrap Row Positions 
         */
        for ( let cur_row1 = 0; cur_row1 < this.grid_rows; cur_row1++ )
        {
            let cur_col_start = this.findNewStartLeft( cur_row1 );
            let cur_col_end   = this.findEndToRight( cur_row1, cur_col_start );

            this.wrap_positons[ "R" + cur_row1 + "C" + ( cur_col_start - 1 ) ] = { row : cur_row1, col : cur_col_end   };
            this.wrap_positons[ "R" + cur_row1 + "C" + ( cur_col_end   + 1 ) ] = { row : cur_row1, col : cur_col_start };
        }

        /*
         * Line Wrap Col Positions 
         */
        for ( let cur_col1 = 0; cur_col1 < this.grid_rows; cur_col1++ )
        {
            let cur_row_start = this.findNewStartToBottom( cur_col1 );
            let cur_row_end   = this.findEndToBottom( cur_row_start, cur_col1 );

            this.wrap_positons[ "R" + ( cur_row_start - 1 ) + "C" + cur_col1 ] = { row : cur_row_end,   col : cur_col1 };
            this.wrap_positons[ "R" + ( cur_row_end   + 1 ) + "C" + cur_col1 ] = { row : cur_row_start, col : cur_col1 };
        }
    }



    public getCharAt( pRow : number, pCol : number ) : string 
    {
        return this.map_input_str[ "R" + pRow + "C" + pCol ] ?? CHAR_NO_MAP
    }

    public getRow() : number 
    {
        return this.cur_row;        
    }

    public getCol() : number 
    {
        return this.cur_col;
    }

    public getGridRows() : number 
    {
        return this.grid_rows;
    }

    public getGridCols() : number 
    {
        return this.grid_cols;
    }

    public getMapInput() : PropertieMap
    {
        return this.map_input_str;
    }

    public getMoveMap() : PropertieMap
    {
        return this.move_map;
    }

    public getCombinedMap() : PropertieMap
    {
        let combined_map : PropertieMap = {...this.map_input_str};

        for (const key of Object.keys( this.move_map )) 
        {
            combined_map[ key ] = this.move_map[ key ]!;
        }

        return combined_map;
    }

    public addRow( pString : string ) : void 
    {
        for ( let input_col : number = 0; input_col < pString.length; input_col++ ) 
        {
            let cur_char_input : string = pString[ input_col ] ?? CHAR_NO_MAP;

            if ( cur_char_input !== CHAR_NO_MAP )
            {
                this.map_input_str[ "R" + this.grid_rows + "C" + input_col ] = cur_char_input;
            }
        }

        if ( pString.length > this.grid_cols )
        {
            this.grid_cols = pString.length;
        }

        this.grid_rows++;
    }

    private findNewStartLeft( pRow : number ) : number 
    {
        for ( let f_index = 0; f_index < this.grid_cols; f_index++ )
        {
            if ( ( this.map_input_str[ "R" + pRow + "C" + f_index ] ?? CHAR_NO_MAP ) != CHAR_NO_MAP )
            {
                return f_index;
            }
        }

        return -1;
    }

    private findNewStartToBottom( pCol : number ) : number 
    {
        for ( let result_row = 0; result_row < this.grid_rows; result_row++ )
        {
            if ( ( this.map_input_str[ "R" + result_row + "C" + pCol ] ?? CHAR_NO_MAP ) != CHAR_NO_MAP )
            {
                return result_row;
            }
        }

        return -1;
    }


    private findEndToRight( pRow : number, pCol : number ) : number 
    {
        for ( let result_col = pCol; result_col < this.grid_cols; result_col++ )
        {
            if ( ( this.map_input_str[ "R" + pRow + "C" + ( result_col + 1 ) ] ?? CHAR_NO_MAP ) == CHAR_NO_MAP )
            {
                return result_col;
            }
        }

        return pCol;
    }

    private findEndToBottom( pRow : number, pCol : number ) : number 
    {
        for ( let result_row = pRow; result_row < this.grid_rows; result_row++ )
        {
            if ( ( this.map_input_str[ "R" + ( result_row + 1 )+ "C" + pCol ] ?? CHAR_NO_MAP ) == CHAR_NO_MAP )
            {
                return result_row;
            }
        }

        return pRow;
    }

    private getWrapPosition( pRow : number, pCol : number ) : Coords | undefined
    {
        return this.wrap_positons[ "R" + pRow + "C" + pCol ] ??  undefined;
    }

    public move( pAmount : number, pDeltaRow : number, pDeltaCol : number, pCharMap : string ) : number
    {
        this.move_map[ "R" + this.cur_row + "C" + this.cur_col ] = pCharMap;

        for ( let step_count = 0; step_count < pAmount; step_count++ )
        {
            /*
             * Check Wrap Around             
             */
            if ( this.getCharAt( this.cur_row + pDeltaRow, this.cur_col + pDeltaCol ) === CHAR_NO_MAP )
            {
                let wrap_coords = this.getWrapPosition( this.cur_row + pDeltaRow, this.cur_col + pDeltaCol );

                if ( wrap_coords === undefined )
                {
                    wl( "ERROR - move - no wrap coords found at R" + ( this.cur_row + pDeltaRow ) + "C" + ( this.cur_col + pDeltaCol ) );

                    throw Error( "ERROR - move - no wrap coords found at R" + ( this.cur_row + pDeltaRow ) + "C" + ( this.cur_col + pDeltaCol ) );
                }

                if ( this.getCharAt( wrap_coords.row, wrap_coords.col ) === CHAR_MAP_WALL )
                {
                    return step_count;
                }

                this.cur_col = wrap_coords.col;
                this.cur_row = wrap_coords.row;
            }
            else
            {
                /*
                 * If there is a wall in the next position, no further 
                 * movement is possible.
                 */
                if ( this.getCharAt( this.cur_row + pDeltaRow, this.cur_col + pDeltaCol ) === CHAR_MAP_WALL )
                {
                    return step_count;
                }

                this.cur_col += pDeltaCol;
                this.cur_row += pDeltaRow;
            }

            this.move_map[ "R" + this.cur_row + "C" + this.cur_col ] = pCharMap;
        }

        return pAmount;
    }


    public toString() : string 
    {
        return "cur_row " + this.cur_row + "  cur_col " + this.cur_col;
    }
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    /*
     * *******************************************************************************************************
     * Parsing the input Array.
     * *******************************************************************************************************
     */
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let monkey_map     : MonkeyMap = new MonkeyMap();

    let knz_parse_map  : boolean = true;

    let move_path_string      : string = "";

    for ( const cur_input_str of pArray ) 
    {
        if ( cur_input_str.trim() === "" )
        {
            knz_parse_map = false;            
        }
        else if ( knz_parse_map )
        {
            monkey_map.addRow( cur_input_str );
        }
        else
        {
            move_path_string += cur_input_str.trim();               
        }
    }

    if ( pKnzDebug )
    {
        wl( "" )
        wl( move_path_string );
    }

    /*
     * *******************************************************************************************************
     * Doing the move path for Part 1
     * *******************************************************************************************************
     */

    monkey_map.determineStartPosition();

    monkey_map.determineWrapPositionsPart1();

    let move_count : number = 0;

    let move_direction : string = DIRECTION_RIGHT;

    move_path_string += END_MOVE_PATH;

    for ( let move_path_index : number = 0; move_path_index < move_path_string.length; move_path_index++ )
    {
        let cur_char = move_path_string.charAt( move_path_index );

        if ( ( cur_char === ROTATE_LEFT ) || ( cur_char === ROTATE_RIGHT ) || ( cur_char === END_MOVE_PATH ) )
        {
            let new_move_direction = getNewDirection( move_direction, cur_char );

            wl( "Direction From " + padR( move_direction, 5 ) + " To " + padR( new_move_direction, 5 ) + " Rotation " + cur_char + "  Move Count " + padL(  move_count, 5 ) );

                 if ( move_direction === DIRECTION_RIGHT ) monkey_map.move( move_count,  0,  1, CHAR_MAP_RIGHT );
            else if ( move_direction === DIRECTION_LEFT  ) monkey_map.move( move_count,  0, -1, CHAR_MAP_LEFT  );
            else if ( move_direction === DIRECTION_UP    ) monkey_map.move( move_count, -1,  0, CHAR_MAP_UP    );
            else if ( move_direction === DIRECTION_DOWN  ) monkey_map.move( move_count,  1,  0, CHAR_MAP_DOWN  );

            if ( cur_char !== END_MOVE_PATH ) 
            {
                move_direction = new_move_direction;
                move_count = 0;
            }
        }
        else if ( ( cur_char >= "0" ) && ( cur_char <= "9" ) )
        {
            move_count = ( move_count * 10 ) + ( move_path_string.charCodeAt( move_path_index ) - 48 );
        }
    }

    if ( pKnzDebug )
    {
        let dbg_map_maze = getDebugMap( monkey_map.getMapInput(),     0, 0, monkey_map.getGridRows(), monkey_map.getGridCols() );
        let dbg_map_move = getDebugMap( monkey_map.getMoveMap(),      0, 0, monkey_map.getGridRows(), monkey_map.getGridCols() );
        let dbg_map_comb = getDebugMap( monkey_map.getCombinedMap(),  0, 0, monkey_map.getGridRows(), monkey_map.getGridCols() );

        wl( "" );
        wl( combineStrings( combineStrings( dbg_map_maze, dbg_map_move ), dbg_map_comb ) );
    }

    /*
     * *******************************************************************************************************
     * Calculating the result value for part 1
     * *******************************************************************************************************
     */

    let row_end = monkey_map.getRow() + 1;
    let col_end = monkey_map.getCol() + 1;

    let result_row       : number = row_end * 1000;
    let result_col       : number = col_end * 4;
    let result_direction : number = getDirectionValue( move_direction );

    wl( "" );
    wl( "Result" );
    wl( "Row " + padR( row_end, 5 )        + " * 1000 = " + padL( result_row,       6 ) );
    wl( "Col " + padR( col_end, 5 )        + " *    4 = " + padL( result_col,       6 ) );
    wl( "Dir " + padR( move_direction, 6 ) + "       = "  + padL( result_direction, 6 ) );

    result_part_01 = result_row + result_col + result_direction;


    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2022__day22_input.txt";

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

    // array_test.push( "   ....#.....   " );
    // array_test.push( "   ..........   " );


    array_test.push( "        ...#" );
    array_test.push( "        .#.." );
    array_test.push( "        #..." );
    array_test.push( "        ...." );
    array_test.push( "...#.......#" );
    array_test.push( "........#..." );
    array_test.push( "..#....#...." );
    array_test.push( "..........#." );
    array_test.push( "        ...#...." );
    array_test.push( "        .....#.." );
    array_test.push( "        .#......" );
    array_test.push( "        ......#." );
    array_test.push( "" );

    array_test.push( "10R5L5R10L4R5L5" );

    return array_test;
}

function placeDebug( pMap : PropertieMap, pRow1 : number, pCol1 : number, pRow2 : number, pCol2 : number, pChar : string ) : void 
{
    let temp_key : string = "";

    temp_key = "R" + pRow1 + "C" + pCol1; pMap[ temp_key ] = pChar;
    temp_key = "R" + pRow1 + "C" + pCol2; pMap[ temp_key ] = pChar;

    temp_key = "R" + pRow2 + "C" + pCol1; pMap[ temp_key ] = pChar;
    temp_key = "R" + pRow2 + "C" + pCol2; pMap[ temp_key ] = pChar;
}

function debugCalcSquare( pSquareWidth : number ) : void 
{
    let square_width : number = pSquareWidth;

    let square_2_top_row    : number = square_width;
    let square_2_left_col   : number = 0;

    let square_2_bottom_row : number = square_2_top_row + square_width;
    let square_2_right_col  : number = square_2_left_col + square_width;

    let square_3_top_row    : number = square_2_top_row;
    let square_3_left_col   : number = square_2_right_col + 1;

    let square_3_bottom_row : number = square_3_top_row + square_width;
    let square_3_right_col  : number = square_3_left_col + square_width;

    let square_4_top_row    : number = square_3_top_row;
    let square_4_left_col   : number = square_3_right_col + 1;

    let square_4_bottom_row : number = square_4_top_row + square_width;
    let square_4_right_col  : number = square_4_left_col + square_width;

    let square_5_top_row    : number = square_4_bottom_row + 1;
    let square_5_left_col   : number = square_4_left_col;

    let square_5_bottom_row : number = square_5_top_row + square_width;
    let square_5_right_col  : number = square_5_left_col + square_width;

    let square_6_top_row    : number = square_5_top_row;
    let square_6_left_col   : number = square_5_right_col + 1;

    let square_6_bottom_row : number = square_6_top_row + square_width;
    let square_6_right_col  : number = square_6_left_col + square_width;

    let square_1_bottom_row : number = square_4_top_row - 1;
    let square_1_left_col   : number = square_4_left_col;

    let square_1_top_row    : number = square_1_bottom_row - ( square_width - 1);
    let square_1_right_col  : number = square_1_left_col + square_width;

    let debug_map : PropertieMap = {};


    wl( "square_width        " + square_width         );
    wl( "" );
    wl( "square_2_top_row    " + square_2_top_row     );
    wl( "square_2_left_col   " + square_2_left_col    );
    wl( "square_2_bottom_row " + square_2_bottom_row  );
    wl( "square_2_right_col  " + square_2_right_col   );
    wl( "" );
    wl( "square_3_top_row    " + square_3_top_row     );
    wl( "square_3_left_col   " + square_3_left_col    );
    wl( "square_3_bottom_row " + square_3_bottom_row  );
    wl( "square_3_right_col  " + square_3_right_col   );
    wl( "" );
    wl( "square_4_top_row    " + square_4_top_row     );
    wl( "square_4_left_col   " + square_4_left_col    );
    wl( "square_4_bottom_row " + square_4_bottom_row  );
    wl( "square_4_right_col  " + square_4_right_col   );
    wl( "" );
    wl( "square_5_top_row    " + square_5_top_row     );
    wl( "square_5_left_col   " + square_5_left_col    );
    wl( "square_5_bottom_row " + square_5_bottom_row  );
    wl( "square_5_right_col  " + square_5_right_col   );
    wl( "" );
    wl( "square_6_top_row    " + square_6_top_row     );
    wl( "square_6_left_col   " + square_6_left_col    );
    wl( "square_6_bottom_row " + square_6_bottom_row  );
    wl( "square_6_right_col  " + square_6_right_col   );
    wl( "" );
    wl( "square_1_top_row    " + square_1_top_row     );
    wl( "square_1_left_col   " + square_1_left_col    );
    wl( "square_1_bottom_row " + square_1_bottom_row  );
    wl( "square_1_right_col  " + square_1_right_col   );


    placeDebug( debug_map, square_1_top_row, square_1_left_col, square_1_bottom_row, square_1_right_col, "1" );
    placeDebug( debug_map, square_2_top_row, square_2_left_col, square_2_bottom_row, square_2_right_col, "2" );
    placeDebug( debug_map, square_3_top_row, square_3_left_col, square_3_bottom_row, square_3_right_col, "3" );
    placeDebug( debug_map, square_4_top_row, square_4_left_col, square_4_bottom_row, square_4_right_col, "4" );
    placeDebug( debug_map, square_5_top_row, square_5_left_col, square_5_bottom_row, square_5_right_col, "5" );
    placeDebug( debug_map, square_6_top_row, square_6_left_col, square_6_bottom_row, square_6_right_col, "6" );

    wl( getDebugMap( debug_map, 0, 0, ( square_width * 4 ),  ( square_width * 5 ) ));

/*
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day22/day_22__Monkey_Map.js
 * 
 * Day22 - Monkey Map
 * 
 * square_width        4
 * square_2_top_row    4
 * square_2_left_col   0
 * square_2_bottom_row 8
 * square_2_right_col  4
 * 
 * square_3_top_row    4
 * square_3_left_col   5
 * square_3_bottom_row 8
 * square_3_right_col  9
 * 
 * square_4_top_row    4
 * square_4_left_col   10
 * square_4_bottom_row 8
 * square_4_right_col  14
 * 
 * square_5_top_row    9
 * square_5_left_col   10
 * square_5_bottom_row 13
 * square_5_right_col  14
 * 
 * square_6_top_row    9
 * square_6_left_col   15
 * square_6_bottom_row 13
 * square_6_right_col  19
 * 
 * square_1_top_row    0
 * square_1_left_col   10
 * square_1_bottom_row 3
 * square_1_right_col  14
 * 
 *      01234567890123456789
 *   0            1   1
 *   1
 *   2
 *   3            1   1
 *   4  2   23   34   4
 *   5
 *   6
 *   7
 *   8  2   23   34   4
 *   9            5   56   6
 *  10
 *  11
 *  12
 *  13            5   56   6
 *  14
 *  15
 * 
 */
}


wl( "" );
wl( "Day22 - Monkey Map" );
wl( "" );

//calcArray( getTestArray1(), true );

//checkReaddatei();

debugCalcSquare( 4 );

wl( "" )
wl( "Day 22 - Ende" );
