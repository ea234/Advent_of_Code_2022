import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2022/day/22
 * 
 * https://www.reddit.com/r/adventofcode/comments/zsct8w/2022_day_22_solutions/
 * 
 * 
 * 
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


function getNewDirection( pOldDirection : string, pRotate : string ) : string
{
    if ( pRotate === ROTATE_LEFT )
    {
        if( pOldDirection === DIRECTION_RIGHT ) return DIRECTION_UP;
        if( pOldDirection === DIRECTION_UP    ) return DIRECTION_LEFT;
        if( pOldDirection === DIRECTION_LEFT  ) return DIRECTION_DOWN;
        //if( pOldDirection === DIRECTION_DOWN )  return DIRECTION_RIGHT;
    }
    else if ( pRotate === ROTATE_RIGHT )
    {
        if( pOldDirection === DIRECTION_RIGHT ) return DIRECTION_DOWN;
        if( pOldDirection === DIRECTION_DOWN  ) return DIRECTION_LEFT;
        if( pOldDirection === DIRECTION_LEFT  ) return DIRECTION_UP;
        //if( pOldDirection === DIRECTION_UP    ) return DIRECTION_RIGHT;
    }

    return DIRECTION_RIGHT;
}


function findMapRight( pString : string ) : number
{
    let find_index = 0;

    while ( find_index < pString.length )
    {
        if ( pString.charAt( find_index ) === CHAR_NO_MAP )
        {
            find_index++;
        }
        else
        {
            break;
        }
    }

    return find_index;
}


function findMapLeft( pString : string ) : number
{
    let find_index = pString.length - 1;

    while ( find_index > 0  )
    {
        if ( pString.charAt( find_index ) === CHAR_NO_MAP )
        {
            find_index--;
        }
        else
        {
            break;
        }
    }

    return find_index;
}


function findMapUp( pString : string[], pCol : number, pRow : number ) : number
{
    let row_index = pRow;

    while ( row_index > 0  )
    {
        let char_at_col = pString[ row_index ]!.charAt( pCol );

        if ( char_at_col === "" )
        {
            char_at_col = CHAR_NO_MAP;
        }

        if ( char_at_col !== CHAR_NO_MAP )
        {
            /*
             * There is still a char other than CHAR_NO_MAP.
             * Decrease the row_index (go further up)
             */
            row_index--;
        }
        else
        {
            break;
        }
    }

    return row_index;
}

function findMapDown( pString : string[], pCol : number, pRow : number ) : number
{
    let row_index = pRow;

    while ( row_index < pString.length )
    {
        let char_at_col = pString[ row_index ]!.charAt( pCol );

        if ( char_at_col === "" )
        {
            char_at_col = CHAR_NO_MAP;
        }

        if ( char_at_col !== CHAR_NO_MAP )
        {
            /*
             * There is still a char other than CHAR_NO_MAP.
             * Decrease the row_index (go further down)
             */
            row_index++;
        }
        else
        {
            break;
        }
    }

    return row_index;
}


class MonkeyMap
{
    map_data : string[] = [];

    cur_row  : number = 1;
    cur_col  : number = 0;

    move_map : PropertieMap = {};

    constructor()
    {
        this.map_data.push( " " );
    }

    public getMoveMap() : PropertieMap
    {
        return this.move_map;
    }

    public addRow( pString : string ) : void 
    {
        this.map_data.push( CHAR_NO_MAP + pString + CHAR_NO_MAP );
    }

    public determineStartPosition() : void 
    {
        let cur_map_string : string = this.map_data[ this.cur_row ]!;

        this.cur_col = findMapRight( cur_map_string );
    }

    public moveRight( pAmount : number ) : number
    {
        this.move_map[ "R" + this.cur_row + "C" + this.cur_col ] = CHAR_MAP_RIGHT;

        let cur_map_row = this.map_data[ this.cur_row ]!;

        for ( let step_count = 0; step_count < pAmount; step_count++ )
        {
            /*
             * Check Wrap Around             
             */
            if ( cur_map_row.charAt( this.cur_col + 1 ) === CHAR_NO_MAP )
            {
                let find_index = findMapRight( cur_map_row );

                if ( cur_map_row.charAt( find_index ) === CHAR_MAP_WALL )
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
                if ( cur_map_row.charAt( this.cur_col + 1 ) === CHAR_MAP_WALL )
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

        let cur_map_row = this.map_data[ this.cur_row ]!;

        for ( let step_count = 0; step_count < pAmount; step_count++ )
        {
            /*
             * Check wrap around in this step.
             */
            if ( cur_map_row.charAt( this.cur_col - 1 ) === CHAR_NO_MAP )
            {
                let find_index = findMapLeft( cur_map_row );

                if ( cur_map_row.charAt( find_index ) === CHAR_MAP_WALL )
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
                if ( cur_map_row.charAt( this.cur_col - 1 ) === CHAR_MAP_WALL )
                {
                    return step_count;
                }

                this.cur_col--;
            }

            this.move_map[ "R" + this.cur_row + "C" + this.cur_col ] = CHAR_MAP_LEFT;
        }

        return pAmount;
    }

    public getCharAt( pRow : number, pCol : number ) : string 
    {
        if ( pRow < 0 ) return CHAR_NO_MAP;
        if ( pRow >= this.map_data.length ) return CHAR_NO_MAP;

        if ( pCol < 0 ) return CHAR_NO_MAP;

        let char_map = this.map_data[ this.cur_row ]!.charAt( pCol );

        if ( char_map === "" ) return CHAR_NO_MAP;

        return char_map;
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
                let find_index = findMapDown( this.map_data, this.cur_row, this.cur_col );

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
                let find_index = findMapUp( this.map_data, this.cur_row, this.cur_col );

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
     * Parsing the input Array. Doing the Movings
     * *******************************************************************************************************
     */
    let start_row        : number = 2;
    let start_col        : number = 0;

    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let grid_rows      : number = 0; 
    let grid_cols      : number = 0;

    let map_input_str  : PropertieMap = {};

    let monkey_map : MonkeyMap = new MonkeyMap();

    let knz_parse_map : boolean = true;

    let move_path : string = "";

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
            move_path += cur_input_str.trim();               
        }
    }

    monkey_map.addRow( " " );

    wl( move_path );

    monkey_map.determineStartPosition();

    wl( monkey_map.toString() );

    let move_count : number = 0;

    let move_direction : string = DIRECTION_RIGHT;

    for ( let index_mp : number = 0; index_mp < move_path.length; index_mp++ )
    {
        let cur_char = move_path.charAt( index_mp );

        if ( ( cur_char === ROTATE_LEFT ) || ( cur_char === ROTATE_RIGHT ) )
        {
            let new_move_direction = getNewDirection( move_direction, cur_char );

            wl( "Direction From " + padR( move_direction, 5 ) + " To " + padR( new_move_direction, 5 ) + " Rotation " + cur_char + "  Move Count " + padL(  move_count, 5 ) );

                 if ( move_direction === DIRECTION_RIGHT ) monkey_map.moveRight( move_count );
            else if ( move_direction === DIRECTION_LEFT  ) monkey_map.moveLeft( move_count );
            else if ( move_direction === DIRECTION_UP    ) monkey_map.moveUp( move_count );
            else if ( move_direction === DIRECTION_DOWN  ) monkey_map.moveDown( move_count );

            move_direction = new_move_direction;
            move_count = 0;
        }
        else if ( ( cur_char >= "0" ) && ( cur_char <= "9" ) )
        {
            move_count = ( move_count * 10 ) + ( move_path.charCodeAt( index_mp ) - 48 );
        }
    }

    wl( getDebugMap( monkey_map.getMoveMap(), 0, 0, 10, 15 ) );

    /*
     * *******************************************************************************************************
     * 
     * *******************************************************************************************************
     */

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
