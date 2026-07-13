import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * --- Day 23: Unstable Diffusion ---
 * https://adventofcode.com/2022/day23
 * 
 * https://www.reddit.com/r/adventofcode/comments/zt6xz5/2022_day_23_solutions/
 * 
 * https://github.com/ea234/Advent_of_Code_2022/blob/main/src/Day_23__Unstable_Diffusion.ts
 * C:\Program Files\nodejs\node.exe .\dist\day23\Day_23_Unstable_Diffusion.js
 * 
 * Day 23: Unstable Diffusion
 * 
 * A
 *      012345
 *   0  ......
 *   1  ..##..
 *   2  ..#...
 *   3  ......
 *   4  ..##..
 *   5  ......
 * 
 * Loop Nr. 0
 * 
 * Elf Nr.    0  1002 -> 2 N
 * Elf Nr.    1  1003 -> 3 N
 * Elf Nr.    2  2002 -> 2002 -
 * Elf Nr.    3  4002 -> 3002 N
 * Elf Nr.    4  4003 -> 3003 N
 * 
 *      012345
 *   0  ..##..
 *   1  ......
 *   2  ..#...
 *   3  ..##..
 *   4  ......
 *   5  ......
 * 
 * Loop Nr. 1
 * 
 * Elf Nr.    0  2 -> 1002 S
 * Elf Nr.    1  3 -> 1003 S
 * Elf Nr.    2  2002 -> 3002 S
 * Elf Nr.    3  3002 -> 3002 -
 * Elf Nr.    4  3003 -> 3003 -
 * 
 *      012345
 *   0  ......
 *   1  ..##..
 *   2  ..#...
 *   3  ..##..
 *   4  ......
 *   5  ......
 * 
 * Loop Nr. 2
 * 
 * Elf Nr.    0  1002 -> 1001 W
 * Elf Nr.    1  1003 -> 1002 W
 * Elf Nr.    2  2002 -> 2002 -
 * Elf Nr.    3  3002 -> 3002 -
 * Elf Nr.    4  3003 -> 3003 -
 * 
 *      012345
 *   0  ......
 *   1  .##...
 *   2  ..#...
 *   3  ..##..
 *   4  ......
 *   5  ......
 * 
 * Loop Nr. 3
 * 
 * Elf Nr.    0  1001 -> 1002 E
 * Elf Nr.    1  1002 -> 1003 E
 * Elf Nr.    2  2002 -> 2002 -
 * Elf Nr.    3  3002 -> 3002 -
 * Elf Nr.    4  3003 -> 3003 -
 * 
 *      012345
 *   0  ......
 *   1  ...#..
 *   2  ..#...
 *   3  ..##..
 *   4  ......
 *   5  ......
 * 
 * Loop Nr. 4
 * 
 * Elf Nr.    0  1002 -> 2 N
 * Elf Nr.    1  1003 -> 3 N
 * Elf Nr.    2  2002 -> 2002 -
 * Elf Nr.    3  3002 -> 3002 -
 * Elf Nr.    4  3003 -> 3003 -
 * 
 *      012345
 *   0  ..##..
 *   1  ......
 *   2  ..#...
 *   3  ..##..
 *   4  ......
 *   5  ......
 * 
 * Result Part 1 = 0
 * Result Part 2 = 0
 * 
 * Day 23 - End
 */
type PropertieMap = Record< string, string >;

const STR_COMBINE_SPACER     : string = " ";

const MAP_CHAR_OPEN_SQUARE   : string = ".";
const MAP_CHAR_ELF           : string = "#";

type GridDirection = { rel_row: number; rel_col: number };

const NORTH      : GridDirection = { rel_row : -1, rel_col :  0 };
const SOUTH      : GridDirection = { rel_row :  1, rel_col :  0 };
const EAST       : GridDirection = { rel_row :  0, rel_col : -1 };
const WEST       : GridDirection = { rel_row :  0, rel_col :  1 };

const NORTH_WEST : GridDirection = { rel_row : -1, rel_col : -1 };
const NORTH_EAST : GridDirection = { rel_row : -1, rel_col :  1 };

const SOUTH_WEST : GridDirection = { rel_row :  1, rel_col : -1 };
const SOUTH_EAST : GridDirection = { rel_row :  1, rel_col :  1 };


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


function getDebugMap( pMapInput : PropertieMap, pMinRows : number, pMinCols : number, pMaxRows : number, pMaxCols : number ) : string 
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
            str_result += pMapInput[ "R" + cur_row  + "C" + cur_col ] ?? MAP_CHAR_OPEN_SQUARE;
        }
    }

    return str_result;
}


function checkGrid( pMapInput : PropertieMap, pRow : number, pCol : number, pDirection : GridDirection ) : number
{
    let key : string = "R" + ( pRow + pDirection.rel_row ) + "C" + ( pCol  + pDirection.rel_col );

    return pMapInput[ key ] === MAP_CHAR_ELF ? 1 : 0;
}


function checkNorth( pMapInput : PropertieMap, pRow : number, pCol : number ) : number 
{
    return checkGrid( pMapInput, pRow, pCol, NORTH ) + checkGrid( pMapInput, pRow, pCol, NORTH_WEST ) + checkGrid( pMapInput, pRow, pCol, NORTH_EAST ); 
}


function checkSouth( pMapInput : PropertieMap, pRow : number, pCol : number ) : number 
{
    return checkGrid( pMapInput, pRow, pCol, SOUTH ) + checkGrid( pMapInput, pRow, pCol, SOUTH_WEST ) + checkGrid( pMapInput, pRow, pCol, SOUTH_EAST ); 
}


function checkWest( pMapInput : PropertieMap, pRow : number, pCol : number ) : number 
{
    return checkGrid( pMapInput, pRow, pCol, WEST ) + checkGrid( pMapInput, pRow, pCol, NORTH_WEST ) + checkGrid( pMapInput, pRow, pCol, SOUTH_WEST ); 
}


function checkEast( pMapInput : PropertieMap, pRow : number, pCol : number ) : number 
{
    return checkGrid( pMapInput, pRow, pCol, EAST ) + checkGrid( pMapInput, pRow, pCol, NORTH_EAST ) + checkGrid( pMapInput, pRow, pCol, SOUTH_EAST ); 
}


class Elf 
{
    id : number;

    cur_row : number = 0;
    cur_col : number = 0;

    proposed_dir : string = "X";
    proposed_row : number = 0;
    proposed_col : number = 0;

    cycle : number = 1;

    constructor( pID : number, pRow : number, pCol : number )
    {
        this.cur_row = pRow;
        this.cur_col = pCol;

        this.id = pID;
    }

    public getID()
    {
        return this.id;
    }

    public getCurRow() : number
    {
        return this.cur_row;
    }

    public getCurCol() : number
    {
        return this.cur_col;
    }

    public getProposedRow() : number
    {
        return this.proposed_row;
    }

    public getProposedCol() : number
    {
        return this.proposed_col;
    }

    public doMove2( pGrid : PropertieMap,  pElfArray : Elf[] ) : number  
    {
        for ( const cur_elf of pElfArray ) 
        {
            if ( cur_elf.getID() !== this.id )
            {
                /*
                 * Check for equal proposed coordinates
                 */
                if ( cur_elf.getProposedCoords() === this.getProposedCoords() )
                {
                    /*
                     * The elf has not moved.
                     * 0 is returned.
                     */
                    return 0;
                }

            }
        }

        /*
         * If no other elf has the same proposed coordinates,
         * the elf can move to the new position.
         */

        pGrid[ "R" + this.cur_row + "C" + this.cur_col ] = MAP_CHAR_OPEN_SQUARE;

        this.cur_col = this.proposed_col;

        this.cur_row = this.proposed_row;

        pGrid[ "R" + this.cur_row + "C" + this.cur_col ] = MAP_CHAR_ELF;

        return 1;
    }

    public doMove1( pMapInput : PropertieMap, pGridHeight : number, pGridWidth : number ) : void 
    {
        let elf_count_north : number = checkNorth( pMapInput, this.cur_row, this.cur_col );
        let elf_count_south : number = checkSouth( pMapInput, this.cur_row, this.cur_col );
        let elf_count_west  : number = checkWest(  pMapInput, this.cur_row, this.cur_col );
        let elf_count_east  : number = checkEast(  pMapInput, this.cur_row, this.cur_col );

        this.proposed_row = this.cur_row;
        this.proposed_col = this.cur_col;

        if (( elf_count_north + elf_count_south + elf_count_west + elf_count_east ) !== 0 ) 
        {
            let can_move_north : boolean = this.proposed_row > 0;

            let can_move_south : boolean = this.proposed_row < ( pGridHeight - 1 );

            let can_move_west  : boolean = this.proposed_col > 0;

            let can_move_east  : boolean = this.proposed_col < ( pGridWidth - 1 );

            this.proposed_dir = "-";

            /*
             * Evil - To be optimized
             */
            if ( this.cycle === 1 )
            {
                     if ( ( can_move_north ) && (  elf_count_north === 0 ) ) { this.proposed_dir = "N"; this.proposed_row--; }
                else if ( ( can_move_south ) && (  elf_count_north === 0 ) ) { this.proposed_dir = "S"; this.proposed_row++; }
                else if ( ( can_move_west  ) && (  elf_count_north === 0 ) ) { this.proposed_dir = "W"; this.proposed_col--; }
                else if ( ( can_move_east  ) && (  elf_count_north === 0 ) ) { this.proposed_dir = "E"; this.proposed_col++; }
            }
            else if ( this.cycle === 2 )
            {   
                     if ( ( can_move_south ) && (  elf_count_north === 0 ) ) { this.proposed_dir = "S"; this.proposed_row++; }
                else if ( ( can_move_west  ) && (  elf_count_north === 0 ) ) { this.proposed_dir = "W"; this.proposed_col--; }
                else if ( ( can_move_east  ) && (  elf_count_north === 0 ) ) { this.proposed_dir = "E"; this.proposed_col++; }
                else if ( ( can_move_north ) && (  elf_count_north === 0 ) ) { this.proposed_dir = "N"; this.proposed_row--; }
            }
            else if ( this.cycle === 3 )
            {
                     if ( ( can_move_west  ) && (  elf_count_north === 0 ) ) { this.proposed_dir = "W"; this.proposed_col--; }
                else if ( ( can_move_east  ) && (  elf_count_north === 0 ) ) { this.proposed_dir = "E"; this.proposed_col++; }
                else if ( ( can_move_north ) && (  elf_count_north === 0 ) ) { this.proposed_dir = "N"; this.proposed_row--; }
                else if ( ( can_move_south ) && (  elf_count_north === 0 ) ) { this.proposed_dir = "S"; this.proposed_row++; }
            }
            else 
            {
                     if ( ( can_move_east  ) && (  elf_count_north === 0 ) ) { this.proposed_dir = "E"; this.proposed_col++; }
                else if ( ( can_move_north ) && (  elf_count_north === 0 ) ) { this.proposed_dir = "N"; this.proposed_row--; }
                else if ( ( can_move_south ) && (  elf_count_north === 0 ) ) { this.proposed_dir = "S"; this.proposed_row++; }
                else if ( ( can_move_west  ) && (  elf_count_north === 0 ) ) { this.proposed_dir = "W"; this.proposed_col--; }
            }

            this.cycle++;

            if ( this.cycle > 4 )
            {
                this.cycle = 1;
            }
        }
    }

    public getProposedCoords() : number
    {
        return ( this.proposed_row * 1000 ) + this.proposed_col;
    }

    public getCurCoords() : number
    {
        return ( this.cur_row * 1000 ) + this.cur_col;
    }

    public toString() : string 
    {
        return "Elf Nr. " + padL( this.id, 4 ) + "  " + this.getCurCoords() + " -> " + this.getProposedCoords() + " " + this.proposed_dir;
    }
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let grid_input : PropertieMap = {};

    let grid_rows  : number = 0;
    let grid_cols  : number = pArray[0]!.length;

    let elf_array : Elf[] = [];

    for ( const cur_input_str of pArray ) 
    {
        for ( let cur_col1 = 0; cur_col1 < cur_input_str.length; cur_col1++ ) 
        {
            let cur_char_input : string = cur_input_str[ cur_col1 ] ?? MAP_CHAR_OPEN_SQUARE;

            if ( cur_char_input === MAP_CHAR_ELF )
            {
                grid_input[ "R" + grid_rows + "C" + cur_col1 ] = MAP_CHAR_ELF;

                elf_array.push( new Elf( elf_array.length, grid_rows, cur_col1 ) );
            }
        }

        grid_rows++;
    }

    grid_cols++;

    let dbg_map_source = getDebugMap( grid_input, 0, 0, grid_rows, grid_cols );

    wl( "A" );
    wl( dbg_map_source );

    let loop_nr          : number = 0;
	
    let count_moved_elfs : number = 1;

    while ((loop_nr < 5 ) && ( count_moved_elfs > 0 ) )
    {
        wl( "" );
        wl( "Loop Nr. " + loop_nr );
        wl( "" );
        
        /*
         * Move Part 1
         * Calculate the proposed Coordinates
         */
        for ( const cur_elf of elf_array ) 
        {
            cur_elf.doMove1( grid_input, grid_rows, grid_cols );
        }

        for ( const cur_elf of elf_array ) 
        {
            wl( cur_elf.toString() );
        }

        /*
         * Move Part 2
         * Try to move the elfes to their new proposed coordinates
         */
        count_moved_elfs = 0;

        for ( const cur_elf of elf_array ) 
        {
            count_moved_elfs += cur_elf.doMove2( grid_input, elf_array );
        }

        let dbg_map_source      = getDebugMap( grid_input, 0, 0, grid_rows, grid_cols );

        wl( "" );
        wl( dbg_map_source );

        loop_nr++;
    }

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
    wl( "" );
}


async function readFileLines() : Promise<string[]> 
{
    //const filePath: string = "/home/ea234/typescript/advent_of_code_2022__day23_input.txt";
    const filePath: string = "c:/Daten/advent_of_code_2022__day23_input.txt";

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

    array_test.push( ".....");
    array_test.push( "..##.");
    array_test.push( "..#..");
    array_test.push( ".....");
    array_test.push( "..##.");
    array_test.push( ".....");

    return array_test;
}

wl( "" );
wl( "Day 23: Unstable Diffusion" );
wl( "" );

calcArray( getTestArray1(), true );
//checkReaddatei();

wl( "" )
wl( "Day 23 - End" );
