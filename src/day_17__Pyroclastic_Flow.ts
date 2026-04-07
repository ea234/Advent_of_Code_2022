import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2022/day17
 * 
 * https://www.reddit.com/r/adventofcode/comments/znykq2/2022_day_17_solutions/
 * 
 */

let file_string     : string  = "";
let file_write_on   : boolean = true;

const CHAR_MAP_ROCK   : string = "#";
const CHAR_MAP_SPACE  : string = ".";
const CHAR_MAP_WALL   : string = "|";
const CHAR_MAP_FLOOR  : string = "-";

type Coords       = { col : number, row : number, char : string };

type PropCoords   = Record< string, Coords >;

type PropertieMap = Record< string, string >;


class Day17Shape
{
    elements : Coords[] = [];

    height : number = 0;
    width  : number = 0;

    constructor ( pCsvShape : string )
    {
        const csv_rows = pCsvShape.split( "," );

        this.height = csv_rows.length;

        for ( let cur_row : number = 0; cur_row < this.height; cur_row++ )
        {
            for ( let cur_col : number = 0; cur_col < csv_rows[ cur_row ]!.length; cur_col++ )
            {

                if ( csv_rows[ cur_row ]!.charAt( cur_col ) == CHAR_MAP_ROCK )
                {
                   this.elements.push( { row : cur_row, col : cur_col, char : CHAR_MAP_ROCK } )
                }

                if ( cur_col > this.height )
                {
                    this.width = cur_col;
                }
            }
        }
    }

    public getWicth() : number
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
        for ( const el_i of this.elements )
        {
            pPropM[ "R" + ( pRow + el_i.row ) + "C" + ( pCol + el_i.col ) ] = el_i.char;
        }
    }

    public drawAsNew( pPropM : PropertieMap, pRow : number, pCol : number ) : void 
    {
        for ( const el_i of this.elements )
        {
            pPropM[ "R" + ( pRow + el_i.row ) + "C" + ( pCol + el_i.col ) ] = "@";
        }
    }


    public getElements() : Coords[]
    {
        return this.elements;
    }

    public toString() : string 
    {
        return "Head ";
    }


}


class ShapeProvider
{
    shape_vektor : Day17Shape[] = [];

    next_shape : number = 0;

    constructor()
    {
        let csv_shape_1 = "####";

        let csv_shape_2 = ".#.,###,.#.";

        let csv_shape_3 = "..#,..#,###";

        let csv_shape_4 = "#,#,#,#";

        let csv_shape_5 = "##,##";

        this.shape_vektor.push( new Day17Shape( csv_shape_1 ) );
        this.shape_vektor.push( new Day17Shape( csv_shape_2 ) );
        this.shape_vektor.push( new Day17Shape( csv_shape_3 ) );
        this.shape_vektor.push( new Day17Shape( csv_shape_4 ) );
        this.shape_vektor.push( new Day17Shape( csv_shape_5 ) );

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

    public debugDrawShapes( pPropM : PropertieMap ) : number  
    {
        let cur_row : number = 0;

        for ( const day17_i  of this.shape_vektor )
        {
            day17_i.draw( pPropM, cur_row, 2 );

            wl( cur_row + " " + day17_i.getBottom( cur_row ) );

            cur_row = day17_i.getBottom( cur_row ) + 2;
        }

        return cur_row;
    }

    public getMaxShapeHeight() : number  
    {
        let max_height : number = 0;

        for ( const day17_i  of this.shape_vektor )
        {
            if ( day17_i.getHeight() > max_height )
            {
                max_height = day17_i.getHeight();
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
    shape_provider : ShapeProvider;

    cave_max_h : number = 10;

    cave_map : PropertieMap = {};

    cave_width : number = 0;

    cave_min_row : number = 0;

    cave_min_dbg_row : number = 0;

    cave_col_left_wall : number = 1;
    cave_col_right_wall : number = 1;

    cur_shape_i : Day17Shape = new Day17Shape( "#," );

    cur_shape_row : number = 0;
    cur_shape_col : number = 0;

    shape_counter : number = 0;
    
    cur_jet : string = "";
    jet_idx : number = 0;

    rows_free : number = 3;

    constructor( pShapeProvider : ShapeProvider, pJetStream : string, pCaveWidth : number, pCountRocks : number )
    {
        this.shape_provider = pShapeProvider;

        this.cave_width = pCaveWidth;

        this.cur_jet = pJetStream;


        this.cave_max_h = ( this.shape_provider.getMaxShapeHeight() * ( pCountRocks + 2 ) ) + 2;

        this.reset();
    }

    public reset() : void 
    {
        this.cave_map = {};

        this.cave_col_right_wall = this.cave_col_left_wall + this.cave_width + 1;

        let ground_level = this.cave_max_h;

        for ( let idx : number = 1; idx <= this.cave_width; idx++ )
        {
            this.cave_map[ "R" + ground_level + "C" + ( this.cave_col_left_wall + idx ) ] = CHAR_MAP_FLOOR;
        }

        for ( let idx : number = 0; idx < this.cave_max_h; idx++ )
        {
            this.cave_map[ "R" + idx + "C" + this.cave_col_left_wall  ] = CHAR_MAP_WALL;
            this.cave_map[ "R" + idx + "C" + this.cave_col_right_wall ] = CHAR_MAP_WALL;
        }

        this.cave_min_row = this.cave_max_h;

        this.jet_idx = this.cur_jet.length;

        this.shape_counter = 0;
    }

    public getCaveHeight() : number 
    {
        return this.cave_max_h;
    }
    
    public getCaveMap() : PropertieMap
    {
        return this.cave_map;
    }

    private getJetPushDirection() : number
    {
        this.jet_idx++;

        if ( this.jet_idx >= this.cur_jet.length )
        {
            this.jet_idx = 0;
        }

        let col_direction : number = ( this.cur_jet.charAt( this.jet_idx ) === "<" ? -1 : 1 );

        return col_direction;
    }

    public placeNewShape() 
    {
        /*
         * Each rock appears so that its left edge is two units away from 
         * the left wall and its bottom edge is three units above the highest 
         * rock in the room (or the floor, if there isn't one).        
         */

        this.shape_counter++;

        this.cur_shape_i = this.shape_provider.getNextShape();

        this.cur_shape_row = ( this.cave_min_row - this.rows_free ) - this.cur_shape_i.height;
//        this.cur_shape_row = ( this.cave_min_row  ) - this.cur_shape_i.height;

        this.cur_shape_col = this.cave_col_left_wall + 3;

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

        for ( const coords_cur of this.cur_shape_i.getElements() )
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

        for ( const coords_cur of this.cur_shape_i.getElements() )
        {
            let row_new = top_row_new + coords_cur.row;
            let col_new = this.cur_shape_col + coords_cur.col;

            let key_map = "R" + row_new + "C" + col_new;

            if ( ( this.cave_map[ key_map ] ?? CHAR_MAP_SPACE ) !== CHAR_MAP_SPACE )
            {
                //wl(  this.cave_map[ key_map ]! );

                knz_all_free = false;
            }
        }

        if ( knz_all_free )
        {
            this.cur_shape_row = top_row_new;
        }
        else
        {
            for ( const coords_cur of this.cur_shape_i.getElements() )
            {
                let row_new = this.cur_shape_row + coords_cur.row;

                let col_new = this.cur_shape_col + coords_cur.col;

                let key_map = "R" + row_new + "C" + col_new;

                this.cave_map[ key_map ] = CHAR_MAP_ROCK;

                if ( row_new < this.cave_min_row )
                {
                    this.cave_min_row = row_new;
                }
            }

            this.placeNewShape();
        }


        return knz_all_free === false;
    }


    public getCaveHeightX()
    {
        return this.cave_max_h - this.cave_min_row;
    }


    public getCaveMinRow() 
    {
        return this.cave_min_row;
    }

    public getShapeCounter() : number 
    {
        return this.shape_counter;
    }

    public getDbgMapCurShape() : string
    {
        let dbg_map : PropertieMap = {...this.cave_map};

        this.cur_shape_i.drawAsNew( dbg_map, this.cur_shape_row, this.cur_shape_col );

        return getDebugMap( dbg_map, this.cave_min_dbg_row, 0, this.cave_max_h + 1, this.cave_col_left_wall + this.cave_width + 3 );
    }
}


const INDEX_HEAD    : number = 1;
const INDEX_START   : number = 0;

const STR_COMBINE_SPACER : string = "   "; 



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
            str_result += pHashMap[ "R" + cur_row  + "C" + cur_col ] ?? CHAR_MAP_SPACE;
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
            if ( ( pHashMap[ "R" + cur_row  + "C" + cur_col  ] ?? CHAR_MAP_SPACE ) == pTile )
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

    let s_prov : ShapeProvider = new ShapeProvider();

    let shape_map : PropertieMap = {};

    let dbg_map_l_row : number = s_prov.debugDrawShapes( shape_map );

    let dbg_map_shapes : string = getDebugMap( shape_map, 0, 0, dbg_map_l_row, 10 );

    wl( "" );

//    wl( dbg_map_shapes );

//    let jet_stream = ">>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>";
    let jet_stream = pArray[0];
    let cave_x : Cave = new Cave( s_prov, jet_stream, 7, 2023 );


    let dbg_map_shapes1 : string = getDebugMap( cave_x.getCaveMap(), cave_x.getCaveHeight() - 10, 0, cave_x.getCaveHeight() + 1, 10 );

    wl( "" );

    
  //  wl( dbg_map_shapes1 );


    cave_x.placeNewShape();

    wl( cave_x.getDbgMapCurShape() );

let shape_nr = 0;

for ( let nrx : number = 0; ( nrx < 200_000_000) && ( cave_x.getShapeCounter() < 2023 ); nrx++ )
{

    if ( nrx === 11 )
    {
        wl( "stop ");
    }

    if ( cave_x.doMove() === false ) 
    {
        shape_nr++;
    }

    if ( nrx < 30 )  
    {
        wl( "" );
        wl( "n " + nrx );

        wl( cave_x.getDbgMapCurShape() );
    } 
}


        wl( "" );

        wl( cave_x.getDbgMapCurShape() );


wl( "shape_nr " + shape_nr );
    /*
     * Two seperate loops for the movements for part 1 and part 2, to prevent 
     * an entanglement with the debug-output.
     */

    wl( "" );
    wl( "" );
    wl( " cave_x.getShapeCounter()  " + cave_x.getShapeCounter() );
    wl( "" );

result_part_01 = cave_x.getCaveHeightX();
result_part_02 = cave_x.getCaveMinRow();
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
    wl( "" );
    wl( "" );
    wl( "" );

    //writeFile( "/home/ea234/typescript/day09_log_file.txt", file_string );
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

//calcArray( getTestArray1(), true );

checkReaddatei();

wl( "" )
wl( "Day 09 - Ende" );

/*




 */
