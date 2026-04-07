import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2022/day17
 * 
 * https://www.reddit.com/r/adventofcode/comments/znykq2/2022_day_17_solutions/
 * 
 */

const CHAR_MAP_ROCK   : string = "#";
const CHAR_MAP_SPACE  : string = ".";
const CHAR_MAP_WALL   : string = "|";
const CHAR_MAP_FLOOR  : string = "-";

type Coords       = { col : number, row : number };

const EMPTY_COORDS : Coords[] = [ {row: 0, col: 0} ];

type PropertieMap = Record< string, string >;

class Day17Shape
{
    elements : Coords[] = [];

    height   : number = 0;

    width    : number = 0;

    constructor ( pElements : Coords[] )
    {
        this.elements = pElements;

        for ( let coord_obj of pElements )
        {
            if ( coord_obj.col > this.width )
            {
                this.width = coord_obj.col;
            }

            if ( coord_obj.row > this.height )
            {
                this.height = coord_obj.row;
            }
        }

        this.height++;
        this.width++;
    }

    public getWidth() : number
    {
        return this.width;
    }

    public getHeight() : number 
    {
        return this.height;
    }

    public getRight( pCol : number ) : number 
    {
        return pCol + this.width;
    }

    public getBottom( pRow : number ) : number
    {
        return pRow + this.height;
    }

    public draw( pPropM : PropertieMap, pRow : number, pCol : number ) : void 
    {
        for ( const coords_inst of this.elements )
        {
            pPropM[ "R" + ( pRow + coords_inst.row ) + "C" + ( pCol + coords_inst.col ) ] = CHAR_MAP_ROCK;
        }
    }

    public drawAsNew( pPropM : PropertieMap, pRow : number, pCol : number ) : void 
    {
        for ( const coords_inst of this.elements )
        {
            pPropM[ "R" + ( pRow + coords_inst.row ) + "C" + ( pCol + coords_inst.col ) ] = "@";
        }
    }

    public getElements() : Coords[]
    {
        return this.elements;
    }

    public toString() : string 
    {
        return "Shape W " + this.width + " H " + this.height;
    }
}


class ShapeProvider
{
    shape_vektor : Day17Shape[] = [];

    next_shape : number = 0;

    constructor()
    {

        /*
         *    1       2       3      4     5
         * .......................................
         * .####......#........#.....#.....##.....
         * ..........#.#.......#.....#.....##.....
         * ...........#......###.....#............
         * ..........................#............
         * .......................................
         */

        let shape_1_coords : Coords[] = [ {row: 0, col: 0},{row: 0, col: 3},{row: 0, col: 1},{row: 0, col: 2} ];
        let shape_2_coords : Coords[] = [ {row: 1, col: 0},{row: 1, col: 2},{row: 2, col: 1},{row: 0, col: 1} ];
        let shape_3_coords : Coords[] = [ {row: 2, col: 0},{row: 2, col: 2},{row: 2, col: 1},{row: 0, col: 2},{row: 1, col: 2} ];
        let shape_4_coords : Coords[] = [ {row: 3, col: 0},{row: 0, col: 0},{row: 1, col: 0},{row: 2, col: 0} ];
        let shape_5_coords : Coords[] = [ {row: 1, col: 0},{row: 1, col: 1},{row: 0, col: 0},{row: 0, col: 1} ];
        
        this.shape_vektor.push( new Day17Shape( shape_1_coords ) );
        this.shape_vektor.push( new Day17Shape( shape_2_coords ) );
        this.shape_vektor.push( new Day17Shape( shape_3_coords ) );
        this.shape_vektor.push( new Day17Shape( shape_4_coords ) );
        this.shape_vektor.push( new Day17Shape( shape_5_coords ) );

        this.next_shape = this.shape_vektor.length + 1;
    }

    public getShapeCount() : number 
    {
        return this.shape_vektor.length;
    }

    public getNextShapeNr() : number 
    {
        return this.next_shape;
    }

    public debugDrawShapes( pPropertieMap : PropertieMap ) : number  
    {
        let cur_col : number = 1;
        let cur_row : number = 1;

        for ( const shape_inst  of this.shape_vektor )
        {
            shape_inst.draw( pPropertieMap, cur_row, cur_col );

            cur_col = shape_inst.getRight( cur_col ) + 5;
        }

        return cur_col;
    }

    public getMaxShapeHeight() : number  
    {
        let max_height : number = 0;

        for ( const shape_inst  of this.shape_vektor )
        {
            if ( shape_inst.getHeight() > max_height )
            {
                max_height = shape_inst.getHeight();
            }
        }

        return max_height;
    }

    public getNextShape() : Day17Shape
    {
        this.next_shape++;

        if ( this.next_shape >= this.shape_vektor.length )
        {
            this.next_shape = 0;
        }

        return this.shape_vektor[ this.next_shape ]!;
    }
}


class Cave
{
    cur_shape_inst      : Day17Shape = new Day17Shape( EMPTY_COORDS );

    cur_shape_row       : number = 0;

    cur_shape_col       : number = 0;

    shape_provider      : ShapeProvider;

    shape_counter       : number = 0;

    cave_map            : PropertieMap = {};

    cave_height         : number = 10;

    cave_width          : number = 0;

    cave_top_row        : number = 0;

    cave_min_dbg_row    : number = 0;

    cave_col_wall_left  : number = 1;

    cave_col_wall_right : number = 1;

    rows_free           : number = 3;
    
    jet_stream_vector   : number[] = [];

    jet_stream          : string = "";

    jet_index           : number = 0;

    constructor( pShapeProvider : ShapeProvider, pJetStream : string, pCaveWidth : number, pCountRocks : number )
    {
        this.shape_provider = pShapeProvider;

        this.cave_width = pCaveWidth;

        this.jet_stream = pJetStream;

        for ( let jet_index = 0; jet_index < pJetStream.length; jet_index++ )
        {
            this.jet_stream_vector[ jet_index ] = this.jet_stream.charAt( jet_index ) === "<" ? -1 : 1;
        }

        this.cave_height = ( this.shape_provider.getMaxShapeHeight() * ( pCountRocks + 2 ) ) + 2;

        this.reset();
    }

    public reset() : void 
    {
        this.cave_map = {};

        this.cave_col_wall_right = this.cave_col_wall_left + this.cave_width + 1;

        let ground_level = this.cave_height;

        for ( let idx : number = 1; idx <= this.cave_width; idx++ )
        {
            this.cave_map[ "R" + ground_level + "C" + ( this.cave_col_wall_left + idx ) ] = CHAR_MAP_FLOOR;
        }

        for ( let idx : number = 0; idx < this.cave_height; idx++ )
        {
            this.cave_map[ "R" + idx + "C" + this.cave_col_wall_left  ] = CHAR_MAP_WALL;
            this.cave_map[ "R" + idx + "C" + this.cave_col_wall_right ] = CHAR_MAP_WALL;
        }

        this.cave_top_row = this.cave_height;

        this.jet_index = this.jet_stream.length;

        this.shape_counter = 0;
    }

    public getCaveHeight() : number 
    {
        return this.cave_height;
    }
    
    public getCaveMap() : PropertieMap
    {
        return this.cave_map;
    }

    private getJetPushDirection() : number
    {
        this.jet_index++;

        if ( this.jet_index >= this.jet_stream.length )
        {
            this.jet_index = 0;
        }

        return this.jet_stream_vector[ this.jet_index ]!;
    }

    public placeNewShape() 
    {
        /*
         * Each rock appears so that its left edge is two units away from 
         * the left wall and its bottom edge is three units above the highest 
         * rock in the room (or the floor, if there isn't one).        
         */

        this.shape_counter++;

        this.cur_shape_inst = this.shape_provider.getNextShape();

        this.cur_shape_row = ( this.cave_top_row - this.rows_free ) - this.cur_shape_inst.height;
//        this.cur_shape_row = ( this.cave_min_row  ) - this.cur_shape_i.height;

        this.cur_shape_col = this.cave_col_wall_left + 3;

        this.cave_min_dbg_row = this.cur_shape_row;

        let left_col_new : number = this.cur_shape_col;
/*
        for ( let jet_push_nr = 0; jet_push_nr < this.rows_free; jet_push_nr++ )
        {
            let col_direction = this.getJetPushDirection();

            if ( col_direction === -1 )
            {
                if ( left_col_new <= this.cave_col_left_wall ) 
                {
                    left_col_new += col_direction;
                }
            }
            else // if ( col_direction === 1 )
            {
                if ( ( this.cur_shape_i.getRight( left_col_new ) + 1) < this.cave_col_right_wall ) 
                {
                    left_col_new += col_direction;
                }
            }
        }

  //      this.cur_shape_col = left_col_new;

  
        */
    }

    public doMove() : boolean
    {
        /*
         * -----------------------------------------------------------------------
         * Do the jet push (Col +/- 1)
         */

        let col_direction = this.getJetPushDirection();

        let left_col_new = this.cur_shape_col + col_direction;

        let knz_all_free : boolean = true;

        for ( const coords_cur of this.cur_shape_inst.getElements() )
        {
            let row_new = this.cur_shape_row + coords_cur.row;

            let col_new = left_col_new + coords_cur.col;

            let key_map = "R" + row_new + "C" + col_new;

            if ( ( this.cave_map[ key_map ] ?? CHAR_MAP_SPACE ) !== CHAR_MAP_SPACE )
            {
                knz_all_free = false;
            }
        }

        if ( knz_all_free )
        {
            this.cur_shape_col = left_col_new;
        }
 
        /*
         * -----------------------------------------------------------------------
         * Fall one unit down (Row +1)
         */
        knz_all_free = true;

        let top_row_new : number = this.cur_shape_row + 1;

        for ( const coords_cur of this.cur_shape_inst.getElements() )
        {
            let row_new = top_row_new + coords_cur.row;

            let col_new = this.cur_shape_col + coords_cur.col;

            let key_map = "R" + row_new + "C" + col_new;

            if ( ( this.cave_map[ key_map ] ?? CHAR_MAP_SPACE ) !== CHAR_MAP_SPACE )
            {
                knz_all_free = false;
            }
        }

        if ( knz_all_free )
        {
            this.cur_shape_row = top_row_new;
        }
        else
        {
            for ( const coords_cur of this.cur_shape_inst.getElements() )
            {
                let row_new = this.cur_shape_row + coords_cur.row;

                let col_new = this.cur_shape_col + coords_cur.col;

                let key_map = "R" + row_new + "C" + col_new;

                this.cave_map[ key_map ] = CHAR_MAP_ROCK;

                if ( row_new < this.cave_top_row )
                {
                    this.cave_top_row = row_new;
                }
            }

            this.placeNewShape();
        }


        return knz_all_free === false;
    }


    public getCaveHeightX()
    {
        return this.cave_height - this.cave_top_row;
    }

    public getCaveMinRow() 
    {
        return this.cave_top_row;
    }

    public getShapeCounter() : number 
    {
        return this.shape_counter;
    }

    public getDbgMapCurShape() : string
    {
        let dbg_map : PropertieMap = {...this.cave_map};

        this.cur_shape_inst.drawAsNew( dbg_map, this.cur_shape_row, this.cur_shape_col );

        return getDebugMap( dbg_map, this.cave_min_dbg_row, 0, this.cave_height + 1, this.cave_col_wall_left + this.cave_width + 3 );
    }
}


function wl( pString : string )
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
            str_result += pHashMap[ "R" + cur_row  + "C" + cur_col ] ?? CHAR_MAP_SPACE;
        }
    }

    return str_result;
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    /*
     * *******************************************************************************************************
     * Parsing the input Array. Doing the Movings
     * *******************************************************************************************************
     */
    let result_part_01   : number = 0;
    let result_part_02   : number = 0;

    let shape_provider : ShapeProvider = new ShapeProvider();

    let shape_map      : PropertieMap = {};

    let dbg_map_l_col : number = shape_provider.debugDrawShapes( shape_map );

    let dbg_map_shapes : string = getDebugMap( shape_map, 0, 0, 6, dbg_map_l_col );

    wl( "" );

    wl( dbg_map_shapes );

    let jet_stream = pArray[0]!;

    let iteration_nr : number = 0;

    let cave_inst : Cave = new Cave( shape_provider, jet_stream!, 7, 2023 );

    cave_inst.placeNewShape();

    while( ( iteration_nr < 200_000_000) && ( cave_inst.getShapeCounter() < 2023 ) )
    {
        cave_inst.doMove(); 

        if ( iteration_nr < 30 )  
        {
            wl( "" );
            wl( "n " + iteration_nr );

            wl( cave_inst.getDbgMapCurShape() );
        } 

        iteration_nr++;
    }

    wl( "" );
    wl( "" );

    result_part_01 = cave_inst.getCaveHeightX();
    result_part_02 = cave_inst.getCaveMinRow();

    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
    wl( "" );
    wl( "" );
    wl( "" );
}


async function readFileLines() : Promise<string[]> 
{
    //const filePath: string = "/home/ea234/typescript/advent_of_code_2022__day09_input.txt";
    const filePath: string = "c:/Daten/aoc2022_d17_input.txt";

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

    array_test.push( ">>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>" );

    return array_test;
}


function getTestArray2() : string[] 
{
    const array_test: string[] = [];

    array_test.push( "####" );

    array_test.push( ".#." );
    array_test.push( "###" );
    array_test.push( ".#." );

    array_test.push( "..#" );
    array_test.push( "..#" );
    array_test.push( "###" );

    array_test.push( "#" );
    array_test.push( "#" );
    array_test.push( "#" );
    array_test.push( "#" );

    array_test.push( "##" );
    array_test.push( "##" );

    return array_test;
}


wl( "" );
wl( "Day 17 - Pyroclastic Flow" );
wl( "" );

calcArray( getTestArray1(), true );

//checkReaddatei();

wl( "" )
wl( "Day 17 - Ende" );