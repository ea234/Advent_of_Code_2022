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

    constructor()
    {
    }

    public determineStartPosition() : void 
    {
        this.cur_col = this.findNewStartLeft( this.cur_row );
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

    public findEndToRight( pRow : number, pCol : number ) : number 
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

    public findEndToLeft( pRow : number, pCol : number ) : number 
    {
        for ( let result_col = pCol; result_col >= 0; result_col-- )
        {
            if ( ( this.map_input_str[ "R" + pRow + "C" + ( result_col - 1 ) ] ?? CHAR_NO_MAP ) == CHAR_NO_MAP )
            {
                return result_col;
            }
        }

        return pCol;
    }

    public findEndToTop( pRow : number, pCol : number ) : number 
    {
        for ( let result_row = pRow; result_row >= 0; result_row-- )
        {
            if ( ( this.map_input_str[ "R" + ( result_row - 1 )+ "C" + pCol ] ?? CHAR_NO_MAP ) == CHAR_NO_MAP )
            {
                return result_row;
            }
        }

        return pRow;
    }

    public findEndToBottom( pRow : number, pCol : number ) : number 
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

    public moveRight( pAmount : number ) : number
    {
        this.move_map[ "R" + this.cur_row + "C" + this.cur_col ] = CHAR_MAP_RIGHT;

        for ( let step_count = 0; step_count < pAmount; step_count++ )
        {
            /*
             * Check Wrap Around             
             */
            if ( this.getCharAt( this.cur_row, this.cur_col + 1 ) === CHAR_NO_MAP )
            {
                let find_index = this.findEndToLeft( this.cur_row, this.cur_col );

                if ( this.getCharAt( this.cur_row, find_index ) === CHAR_MAP_WALL )
                {
                    return step_count;
                }

                this.cur_col = find_index;
            }
            else
            {
                /*
                 * If there is a wall in the next position, no further 
                 * movement is possible.
                 */
                if ( this.getCharAt( this.cur_row, this.cur_col + 1 ) === CHAR_MAP_WALL )
                {
                    return step_count;
                }

                this.cur_col++;
            }

            this.move_map[ "R" + this.cur_row + "C" + this.cur_col ] = CHAR_MAP_RIGHT;
        }

        return pAmount;
    }

    public moveLeft( pAmount : number ) : number
    {
        this.move_map[ "R" + this.cur_row + "C" + this.cur_col ] = CHAR_MAP_LEFT;


        for ( let step_count = 0; step_count < pAmount; step_count++ )
        {
            /*
             * Check wrap around in this step.
             */
            if ( this.getCharAt( this.cur_row, this.cur_col - 1 ) === CHAR_NO_MAP )
            {
                let find_index = this.findEndToRight( this.cur_row, this.cur_col );

                if ( this.getCharAt( this.cur_row, find_index ) === CHAR_MAP_WALL )
                {
                    return step_count;
                }

                this.cur_col = find_index;
            }
            else 
            {
                /*
                 * If there is a wall in the next position, no further 
                 * movement is possible.
                 */
                if ( this.getCharAt( this.cur_row, this.cur_col - 1 ) === CHAR_MAP_WALL )
                {
                    return step_count;
                }

                this.cur_col--;
            }

            this.move_map[ "R" + this.cur_row + "C" + this.cur_col ] = CHAR_MAP_LEFT;
        }

        return pAmount;
    }

    public moveUp( pAmount : number ) : number
    {
        this.move_map[ "R" + this.cur_row + "C" + this.cur_col ] = CHAR_MAP_UP;

        for ( let step_count = 0; step_count < pAmount; step_count++ )
        {
            /*
             * Check wrap around in this step.
             */
            if ( this.getCharAt( this.cur_row - 1, this.cur_col ) === CHAR_NO_MAP )
            {
                let find_index = this.findEndToBottom( this.cur_row, this.cur_col );

                if ( this.getCharAt( find_index, this.cur_col ) === CHAR_MAP_WALL )
                {
                    return step_count;
                }

                this.cur_row = find_index;
            }
            else 
            {
                /*
                 * If there is a wall in the next position, no further 
                 * movement is possible.
                 */
                if ( this.getCharAt( this.cur_row - 1, this.cur_col ) === CHAR_MAP_WALL )
                {
                    return step_count;
                }

                this.cur_row--;
            }

            this.move_map[ "R" + this.cur_row + "C" + this.cur_col ] = CHAR_MAP_UP;
        }

        return pAmount;
    }

    public moveDown( pAmount : number ) : number
    {
        this.move_map[ "R" + this.cur_row + "C" + this.cur_col ] = CHAR_MAP_DOWN;

        for ( let step_count = 0; step_count < pAmount; step_count++ )
        {
            /*
             * Check wrap around in this step.
             */
            if ( this.getCharAt( this.cur_row + 1, this.cur_col ) === CHAR_NO_MAP )
            {
                let find_index = this.findEndToTop( this.cur_row, this.cur_col );

                if ( this.getCharAt( find_index, this.cur_col ) === CHAR_MAP_WALL )
                {
                    return step_count;
                }

                this.cur_row = find_index;
            }
            else 
            {
                /*
                 * If there is a wall in the next position, no further 
                 * movement is possible.
                 */
                if ( this.getCharAt( this.cur_row + 1, this.cur_col ) === CHAR_MAP_WALL )
                {
                    return step_count;
                }

                this.cur_row++;
            }

            this.move_map[ "R" + this.cur_row + "C" + this.cur_col ] = CHAR_MAP_DOWN;
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
     * Doing the move path
     * *******************************************************************************************************
     */

    monkey_map.determineStartPosition();

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

                 if ( move_direction === DIRECTION_RIGHT ) monkey_map.moveRight( move_count );
            else if ( move_direction === DIRECTION_LEFT  ) monkey_map.moveLeft( move_count );
            else if ( move_direction === DIRECTION_UP    ) monkey_map.moveUp( move_count );
            else if ( move_direction === DIRECTION_DOWN  ) monkey_map.moveDown( move_count );

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


function testFindMap(): void 
{
    let temp_map_string : string = "";

    let map_start_index : number = 0;

    temp_map_string = "A.....  ";
    map_start_index = findMapRight( temp_map_string );

    wl( "Find Map Right = " + temp_map_string + " " + map_start_index + "  " + temp_map_string.charAt( map_start_index ) );

    temp_map_string = " B..... ";
    map_start_index = findMapRight( temp_map_string );

    wl( "Find Map Right = " + temp_map_string + " " + map_start_index + "  " + temp_map_string.charAt( map_start_index ) );

    temp_map_string = "   .....C";
    map_start_index = findMapLeft( temp_map_string );

    wl( "Find Map Left = " + temp_map_string + " " + map_start_index + "  " + temp_map_string.charAt( map_start_index ) );

    temp_map_string = "   ....D ";
    map_start_index = findMapLeft( temp_map_string );

    wl( "Find Map Left = " + temp_map_string + " " + map_start_index + "  " + temp_map_string.charAt( map_start_index ) );
}

wl( "" );
wl( "Day22 - Monkey Map" );
wl( "" );

calcArray( getTestArray1(), true );

//checkReaddatei();

wl( "" )
wl( "Day 22 - Ende" );
