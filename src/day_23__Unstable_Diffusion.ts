import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * --- Day 23: Unstable Diffusion ---
 * https://adventofcode.com/2022/day23
 * 
 * https://www.reddit.com/r/adventofcode/comments/zt6xz5/2022_day_23_solutions/
 * 
 * https://github.com/ea234/Advent_of_Code_2022/blob/main/src/day_23__Unstable_Diffusion.ts
 * 
 * 
 * C:\Program Files\nodejs\node.exe .\dist\day23\day_23__Unstable_Diffusion.js
 * 
 * Day 23: Unstable Diffusion
 * 
 * Initial Map
 *      0123456
 *   0  .......
 *   1  ..AB...
 *   2  ..C....
 *   3  .......
 *   4  ..DE...
 *   5  .......
 *   6  .......
 * 
 * --------------------------------------------------------------------------------
 * Loop Nr. 1
 * 
 * Elf Nr.    0 A   11002 -> 10002 N MOVE   N0 S1 W0 E1   N,S,W,E
 * Elf Nr.    1 B   11003 -> 10003 N MOVE   N0 S1 W2 E0   N,S,W,E
 * Elf Nr.    2 C   12002 -> 13002 S MOVE   N2 S0 W0 E1   N,S,W,E
 * Elf Nr.    3 D   14002 -> 13002 N MOVE   N0 S0 W0 E1   N,S,W,E
 * Elf Nr.    4 E   14003 -> 13003 N MOVE   N0 S0 W1 E0   N,S,W,E
 * 
 * count_moved_elfs 3
 * 
 *      0123456          0123456
 *   0  .......       0  ..AB...
 *   1  ..AB...       1  .......
 *   2  ..C....       2  ..C....
 *   3  .......       3  ...E...
 *   4  ..DE...       4  ..D....
 *   5  .......       5  .......
 *   6  .......       6  .......
 * 
 * --------------------------------------------------------------------------------
 * Loop Nr. 2
 * 
 * Elf Nr.    0 A   10002 -> 11002 S MOVE   N0 S0 W0 E1   S,W,E,N
 * Elf Nr.    1 B   10003 -> 11003 S MOVE   N0 S0 W1 E0   S,W,E,N
 * Elf Nr.    2 C   12002 -> 12001 W MOVE   N0 S1 W0 E1   S,W,E,N
 * Elf Nr.    3 D   14002 -> 15002 S MOVE   N1 S0 W0 E1   S,W,E,N
 * Elf Nr.    4 E   13003 -> 13004 E MOVE   N1 S1 W2 E0   S,W,E,N
 * 
 * count_moved_elfs 5
 * 
 *      0123456          0123456
 *   0  ..AB...       0  .......
 *   1  .......       1  ..AB...
 *   2  ..C....       2  .C.....
 *   3  ...E...       3  ....E..
 *   4  ..D....       4  .......
 *   5  .......       5  ..D....
 *   6  .......       6  .......
 * 
 * --------------------------------------------------------------------------------
 * Loop Nr. 3
 * 
 * Elf Nr.    0 A   11002 -> 10002 N MOVE   N0 S1 W1 E1   W,E,N,S
 * Elf Nr.    1 B   11003 -> 11004 E MOVE   N0 S0 W1 E0   W,E,N,S
 * Elf Nr.    2 C   12001 -> 12000 W MOVE   N1 S0 W0 E1   W,E,N,S
 * Elf Nr.    3 D   15002 -> 15002 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.    4 E   13004 -> 13004 -  --    N0 S0 W0 E0   W,E,N,S
 * 
 * count_moved_elfs 3
 * 
 *      0123456          0123456
 *   0  .......       0  ..A....
 *   1  ..AB...       1  ....B..
 *   2  .C.....       2  C......
 *   3  ....E..       3  ....E..
 *   4  .......       4  .......
 *   5  ..D....       5  ..D....
 *   6  .......       6  .......
 * 
 * --------------------------------------------------------------------------------
 * Loop Nr. 4
 * 
 * Elf Nr.    0 A   10002 -> 10002 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    1 B   11004 -> 11004 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    2 C   12000 -> 12000 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    3 D   15002 -> 15002 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    4 E   13004 -> 13004 -  --    N0 S0 W0 E0   E,N,S,W
 * 
 * count_moved_elfs 0
 * 
 *      0123456          0123456
 *   0  ..A....       0  ..A....
 *   1  ....B..       1  ....B..
 *   2  C......       2  C......
 *   3  ....E..       3  ....E..
 *   4  .......       4  .......
 *   5  ..D....       5  ..D....
 *   6  .......       6  .......
 * 
 * rect_row_min =>0<
 * rect_col_min =>0<
 * rect_row_max =>5<
 * rect_col_max =>4<
 * 
 * Result Part 1 = 0
 * Result Part 2 = 0
 * 
 * Day 23 - End
 */
type PropertieMap = Record< string, string >;

const STR_COMBINE_SPACER     : string = "     ";

const MAP_CHAR_OPEN_SQUARE   : string = ".";
const MAP_CHAR_ELF           : string = "#";

type GridDirection = { rel_row: number; rel_col: number };

const NORTH      : GridDirection = { rel_row : -1, rel_col :  0 };
const SOUTH      : GridDirection = { rel_row :  1, rel_col :  0 };
const EAST       : GridDirection = { rel_row :  0, rel_col :  1 };
const WEST       : GridDirection = { rel_row :  0, rel_col : -1 };

const NORTH_WEST : GridDirection = { rel_row : -1, rel_col : -1 };
const NORTH_EAST : GridDirection = { rel_row : -1, rel_col :  1 };

const SOUTH_WEST : GridDirection = { rel_row :  1, rel_col : -1 };
const SOUTH_EAST : GridDirection = { rel_row :  1, rel_col :  1 };

const cycleOrders: string[][] = [
['N','S','W','E'], 
['S','W','E','N'], 
['W','E','N','S'], 
['E','N','S','W'], 
];

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


function combineStrings( pString1: string | undefined | null, pString2: string | undefined | null) : string 
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


function getDebugMap( pMapInput : PropertieMap, pMinRows : number, pMinCols : number, pMaxRows : number, pMaxCols : number ) : string 
{
    let str_result : string = "";

    str_result += padL( " ", 3 ) + "  ";

    for ( let cur_col = pMinCols; cur_col <= pMaxCols; cur_col++ )
    {
        str_result += Math.abs( cur_col ) % 10;
    }

    for ( let cur_row = pMinRows; cur_row <= pMaxRows; cur_row++ )
    {
        str_result += "\n";
        str_result += padL( cur_row, 3 ) + "  ";

        for ( let cur_col = pMinCols; cur_col <= pMaxCols; cur_col++ )
        {
            str_result += pMapInput[ "R" + cur_row  + "C" + cur_col ] ?? MAP_CHAR_OPEN_SQUARE;
        }
    }

    return str_result;
}


function countChar( pMapInput : PropertieMap, pMinRows : number, pMinCols : number, pMaxRows : number, pMaxCols : number ) : number  
{
    let nr_result : number = 0;

    for ( let cur_row = pMinRows; cur_row <= pMaxRows; cur_row++ )
    {
        for ( let cur_col = pMinCols; cur_col <= pMaxCols; cur_col++ )
        {
            nr_result += ( pMapInput[ "R" + cur_row  + "C" + cur_col ] ?? MAP_CHAR_OPEN_SQUARE )  === MAP_CHAR_OPEN_SQUARE ? 1 :0;
        }
    }

    return nr_result;
}


function checkGrid( pMapInput : PropertieMap, pRow : number, pCol : number, pDirection : GridDirection ) : number
{
    /*
     * Generate the key with the relative positions from the GridDirection
     */
    let key : string = "R" + ( pRow + pDirection.rel_row ) + "C" + ( pCol  + pDirection.rel_col );

    /*
     * Check, if there is an elf at that key-position
     */
    return ( pMapInput[ key ] ?? MAP_CHAR_OPEN_SQUARE ) === MAP_CHAR_OPEN_SQUARE ? 0 : 1;
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

    elf_count_north : number = 0;
    elf_count_south : number = 0;
    elf_count_west  : number = 0;
    elf_count_east  : number = 0;

    cycle_nr : number = 0;

    cycle_index : string = "----";

    elf_char : string ; 
    
    constructor( pID : number, pRow : number, pCol : number )
    {
        this.cur_row = pRow;

        this.cur_col = pCol;

        this.id = pID;

        /*
         * For debugging, set a character for the map
         */
        this.elf_char = "ABCDEFGHIJKLMNOPQRSTUVWXabcdefghijklmnop"[ this.id ] ?? MAP_CHAR_ELF;
    }

    public doMove1( pMapInput : PropertieMap, pGridHeight : number, pGridWidth : number ) : void 
    {
        /*
         * Count the number of elfes in the top, left, right and bottom row.
         */
        this.elf_count_north  = checkNorth( pMapInput, this.cur_row, this.cur_col );
        this.elf_count_south  = checkSouth( pMapInput, this.cur_row, this.cur_col );
        this.elf_count_west   = checkWest(  pMapInput, this.cur_row, this.cur_col );
        this.elf_count_east   = checkEast(  pMapInput, this.cur_row, this.cur_col );

        let elf_surrounding : number = this.elf_count_north + this.elf_count_south + this.elf_count_west + this.elf_count_east;

        /*
         * The initial proposed coordinates, are the current coordinates.
         */
        this.proposed_row = this.cur_row;
        this.proposed_col = this.cur_col;

        this.proposed_dir = "-";

        /*
         * If all adjacent positions are free (=no elf), then the current elf doesn't move.
         */
        if ( elf_surrounding !== 0 ) 
        {
            /*
             * Grid Boundaries
             * Check wether the elf can move in a certain direction.
             * If the elf is already at the boundarie, the elf cant move.
             */
            let can_move_north : boolean = this.proposed_row > 0;

            let can_move_south : boolean = this.proposed_row < ( pGridHeight - 1 );

            let can_move_west  : boolean = this.proposed_col > 0;

            let can_move_east  : boolean = this.proposed_col < ( pGridWidth - 1 );

            for ( const cycle_direction of cycleOrders[ this.cycle_nr ]! ) 
            {
                switch ( cycle_direction ) 
                {
                    case 'N':

                        if ( ( can_move_north ) && ( this.elf_count_north === 0 ) ) 
                        {
                            this.proposed_dir = 'N';
                            this.proposed_row--;
                        }

                        break;

                    case 'S':

                        if ( ( can_move_south ) && ( this.elf_count_south === 0 ) )
                        {
                            this.proposed_dir = 'S';
                            this.proposed_row++;
                        }

                        break;

                    case 'W':

                        if ( ( can_move_west  ) && ( this.elf_count_west === 0 ) ) 
                        {
                            this.proposed_dir = 'W';
                            this.proposed_col--;
                        }

                        break;

                    case 'E':

                        if ( ( can_move_east  ) && ( this.elf_count_east === 0 ) )
                        {
                            this.proposed_dir = 'E';
                            this.proposed_col++;
                        }
                }
                
                /*
                 * If a new proposed direction is found, 
                 * exit the loop.
                 */
                if ( this.proposed_dir !== '-' ) break; 
            }
        }

        /*
         * For debug purposes, get the current cycle orders
         */
        this.cycle_index = cycleOrders[ this.cycle_nr ]!.join( ',' );

        /*
         * Increase the cycle nr for the next move
         */
        this.cycle_nr++;

        /*
         * If the cycle nr is greater than 3, set it to 0.
         */
        if ( this.cycle_nr > 3 )
        {
            this.cycle_nr = 0;
        }
    }

    public doMove2( pGrid : PropertieMap, pElfArray : Elf[] ) : number  
    {
        /*
         * Check, wether any of the other elfs has the same 
         * proposed position as the current elf.
         */
        for ( const cur_elf of pElfArray ) 
        {
            if ( cur_elf.getID() !== this.id )
            {
                /*
                 * Check for equal proposed coordinates
                 */
                if ( cur_elf.getProposedCoords() === this.getProposedCoords() )
                {
                    pGrid[ "R" + this.cur_row + "C" + this.cur_col ] = this.elf_char;
                    
                    /*
                     * The elf has not moved.
                     * 0 is returned.
                     */
                    return 0;
                }
            }
        }

        /*
         * If the proposed coordinates are the same as 
         * the current coordinates, the elf doesn't move.
         */
        if ( this.getProposedCoords() === this.getCurCoords() )
        {
            return 0;
        }

        /*
         * If no other elf has the same proposed coordinates, and the 
         * proposed coordinates differ from the  current coordinates, 
         * the elf can move to the new position.
         */

        /*
         * Clear the position in the grid
         */
        pGrid[ "R" + this.cur_row + "C" + this.cur_col ] = MAP_CHAR_OPEN_SQUARE;

        /*
         * Set the new current position 
         */
        this.cur_col = this.proposed_col;

        this.cur_row = this.proposed_row;

        /*
         * Set the elf character in the grid
         */
        pGrid[ "R" + this.cur_row + "C" + this.cur_col ] = this.elf_char;

        return 1;
    }

    public getID()
    {
        return this.id;
    }

    public getElfChar() : string 
    {
        return this.elf_char;
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

    public getProposedCoords() : number
    {
        return 10_000 + ( this.proposed_row * 1000 ) + this.proposed_col;
    }

    public getCurCoords() : number
    {
        return 10_000 + ( this.cur_row * 1000 ) + this.cur_col;
    }

    public doesMove() : boolean 
    {
        return this.getProposedCoords() !== this.getCurCoords();
    }

    public toString() : string 
    {
        let move_knz : String = this.doesMove() ? "MOVE" : " -- ";

        return "Elf Nr. " + padL( this.id, 4 ) + " " + this.elf_char + "   " + this.getCurCoords() + " -> " + this.getProposedCoords() + " " + this.proposed_dir + " " + move_knz + "   N" + this.elf_count_north  + " S" + this.elf_count_south  + " W" + this.elf_count_west  + " E" + this.elf_count_east + "   " + this.cycle_index;
    }
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let grid_input : PropertieMap = {};

    let grid_rows  : number = 0;
    let grid_cols  : number = pArray[0]!.length;

    let elf_array  : Elf[] = [];

    /*
     * Creating the elf array from the input and setting the 
     * initial grid positions. 
     */
    for ( const cur_input_str of pArray ) 
    {
        for ( let cur_col1 = 0; cur_col1 < cur_input_str.length; cur_col1++ ) 
        {
            let cur_char_input : string = cur_input_str[ cur_col1 ] ?? MAP_CHAR_OPEN_SQUARE;

            if ( cur_char_input === MAP_CHAR_ELF )
            {
                let cur_elf : Elf =  new Elf( elf_array.length, grid_rows, cur_col1 );

                grid_input[ "R" + grid_rows + "C" + cur_col1 ] = cur_elf.getElfChar();

                elf_array.push( cur_elf );
            }
        }

        grid_rows++;
    }

    grid_cols++;

    let dbg_map_before = getDebugMap( grid_input, 0, 0, grid_rows, grid_cols );

    wl( "Initial Map" );
    wl( dbg_map_before );

    let rect_row_min : number = grid_rows;
    let rect_col_min : number = grid_cols;
    let rect_row_max : number = 0;
    let rect_col_max : number = 0;
    
    let loop_nr          : number = 1;
    let count_moved_elfs : number = 1;

    while ( ( loop_nr < 11 ) && ( count_moved_elfs > 0 ) )
    {
        wl( "" );
        wl( "--------------------------------------------------------------------------------" );
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

        dbg_map_before = getDebugMap( grid_input, 0, 0, grid_rows, grid_cols );

        count_moved_elfs = 0;

        rect_row_min = grid_rows;
        rect_col_min = grid_cols;
        rect_row_max = 0;
        rect_col_max = 0;

        for ( const cur_elf of elf_array ) 
        {
            count_moved_elfs += cur_elf.doMove2( grid_input, elf_array );

            if ( cur_elf.getCurRow() < rect_row_min ) rect_row_min = cur_elf.getCurRow();

            if ( cur_elf.getCurRow() > rect_row_max ) rect_row_max = cur_elf.getCurRow();

            if ( cur_elf.getCurCol() < rect_col_min ) rect_col_min = cur_elf.getCurCol();
            
            if ( cur_elf.getCurCol() > rect_col_max ) rect_col_max = cur_elf.getCurCol();
        }

        let dbg_map_10 : string = "";

        if ( loop_nr === 10 )
        {
            dbg_map_10 = getDebugMap( grid_input, rect_row_min, rect_col_min, rect_row_max, rect_col_max );

            result_part_01 = countChar( grid_input, rect_row_min, rect_col_min, rect_row_max, rect_col_max );
        }

        let dbg_map_after : string = getDebugMap( grid_input, 0, 0, grid_rows, grid_cols );

        wl( "" );
        wl( "count_moved_elfs " + count_moved_elfs );
        wl( "" );
        wl( combineStrings(  combineStrings( dbg_map_before, dbg_map_after ), dbg_map_10 ) );

        loop_nr++;
    }

    wl( "" );
    wl( "" );
    wl( "rect_row_min =>" + rect_row_min + "<" );
    wl( "rect_col_min =>" + rect_col_min + "<" );
    wl( "rect_row_max =>" + rect_row_max + "<" );
    wl( "rect_col_max =>" + rect_col_max + "<" );
    wl( "" );
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


function getTestArray2() : string[] 
{
    const array_test: string[] = [];

    array_test.push( ".............." );
    array_test.push( ".......#......" );
    array_test.push( ".....###.#...." );
    array_test.push( "...#...#.#...." );
    array_test.push( "....#...##...." );
    array_test.push( "...#.###......" );
    array_test.push( "...##.#.##...." );
    array_test.push( "....#..#......" );
    array_test.push( ".............." );
    array_test.push( ".............." );
    array_test.push( ".............." );

    return array_test;
}


wl( "" );
wl( "Day 23: Unstable Diffusion" );
wl( "" );

calcArray( getTestArray2(), true );
//checkReaddatei();

wl( "" )
wl( "Day 23 - End" );
 /*

C:\Program Files\nodejs\node.exe .\dist\day23\day_23__Unstable_Diffusion.js

Day 23: Unstable Diffusion

Initial Map
     0123456789012345
  0  ................
  1  .......A........
  2  .....BCD.E......
  3  ...F...G.H......
  4  ....I...JK......
  5  ...L.MNO........
  6  ...PQ.R.ST......
  7  ....U..V........
  8  ................
  9  ................
 10  ................
 11  ................

--------------------------------------------------------------------------------
Loop Nr. 1

Elf Nr.    0 A   11007 -> 10007 N MOVE   N0 S2 W1 E0   N,S,W,E
Elf Nr.    1 B   12005 -> 11005 N MOVE   N0 S0 W0 E1   N,S,W,E
Elf Nr.    2 C   12006 -> 12006 -  --    N1 S1 W1 E3   N,S,W,E
Elf Nr.    3 D   12007 -> 12008 E MOVE   N1 S1 W1 E0   N,S,W,E
Elf Nr.    4 E   12009 -> 11009 N MOVE   N0 S1 W0 E0   N,S,W,E
Elf Nr.    5 F   13003 -> 12003 N MOVE   N0 S1 W0 E1   N,S,W,E
Elf Nr.    6 G   13007 -> 13007 -  --    N2 S1 W1 E1   N,S,W,E
Elf Nr.    7 H   13009 -> 13010 E MOVE   N1 S2 W1 E0   N,S,W,E
Elf Nr.    8 I   14004 -> 14004 -  --    N1 S2 W2 E1   N,S,W,E
Elf Nr.    9 J   14008 -> 14008 -  --    N2 S1 W2 E2   N,S,W,E
Elf Nr.   10 K   14009 -> 15009 S MOVE   N1 S0 W1 E0   N,S,W,E
Elf Nr.   11 L   15003 -> 15002 W MOVE   N1 S2 W0 E2   N,S,W,E
Elf Nr.   12 M   15005 -> 15005 -  --    N1 S2 W2 E2   N,S,W,E
Elf Nr.   13 N   15006 -> 14006 N MOVE   N0 S1 W1 E1   N,S,W,E
Elf Nr.   14 O   15007 -> 15007 -  --    N1 S2 W2 E2   N,S,W,E
Elf Nr.   15 P   16003 -> 16002 W MOVE   N1 S1 W0 E2   N,S,W,E
Elf Nr.   16 Q   16004 -> 16004 -  --    N2 S1 W2 E1   N,S,W,E
Elf Nr.   17 R   16006 -> 16006 -  --    N3 S1 W1 E2   N,S,W,E
Elf Nr.   18 S   16008 -> 16008 -  --    N1 S1 W2 E1   N,S,W,E
Elf Nr.   19 T   16009 -> 15009 N MOVE   N0 S0 W1 E0   N,S,W,E
Elf Nr.   20 U   17004 -> 18004 S MOVE   N2 S0 W1 E0   N,S,W,E
Elf Nr.   21 V   17007 -> 18007 S MOVE   N2 S0 W1 E1   N,S,W,E

count_moved_elfs 11

     0123456789012345          0123456789012345
  0  ................       0  .......A........
  1  .......A........       1  .....B...E......
  2  .....BCD.E......       2  ...F..C.D.......
  3  ...F...G.H......       3  .......G..H.....
  4  ....I...JK......       4  ....I.N.JK......
  5  ...L.MNO........       5  ..L..M.O........
  6  ...PQ.R.ST......       6  ..P.Q.R.ST......
  7  ....U..V........       7  ................
  8  ................       8  ....U..V........
  9  ................       9  ................
 10  ................      10  ................
 11  ................      11  ................

--------------------------------------------------------------------------------
Loop Nr. 2

Elf Nr.    0 A   10007 -> 10007 -  --    N0 S0 W0 E0   S,W,E,N
Elf Nr.    1 B   11005 -> 11004 W MOVE   N0 S1 W0 E1   S,W,E,N
Elf Nr.    2 C   12006 -> 12006 -  --    N1 S1 W1 E1   S,W,E,N
Elf Nr.    3 D   12008 -> 12008 -  --    N1 S1 W1 E1   S,W,E,N
Elf Nr.    4 E   11009 -> 11010 E MOVE   N0 S1 W1 E0   S,W,E,N
Elf Nr.    5 F   12003 -> 12003 -  --    N0 S0 W0 E0   S,W,E,N
Elf Nr.    6 G   13007 -> 13007 -  --    N2 S2 W2 E2   S,W,E,N
Elf Nr.    7 H   13010 -> 13011 E MOVE   N0 S1 W1 E0   S,W,E,N
Elf Nr.    8 I   14004 -> 14003 W MOVE   N0 S1 W0 E1   S,W,E,N
Elf Nr.    9 J   14008 -> 14008 -  --    N1 S1 W2 E1   S,W,E,N
Elf Nr.   10 K   14009 -> 15009 S MOVE   N1 S0 W1 E1   S,W,E,N
Elf Nr.   11 L   15002 -> 15001 W MOVE   N0 S1 W0 E0   S,W,E,N
Elf Nr.   12 M   15005 -> 15005 -  --    N2 S2 W2 E2   S,W,E,N
Elf Nr.   13 N   14006 -> 14006 -  --    N1 S2 W1 E2   S,W,E,N
Elf Nr.   14 O   15007 -> 15007 -  --    N2 S2 W2 E2   S,W,E,N
Elf Nr.   15 P   16002 -> 17002 S MOVE   N1 S0 W0 E0   S,W,E,N
Elf Nr.   16 Q   16004 -> 17004 S MOVE   N1 S0 W0 E1   S,W,E,N
Elf Nr.   17 R   16006 -> 17006 S MOVE   N2 S0 W1 E1   S,W,E,N
Elf Nr.   18 S   16008 -> 17008 S MOVE   N1 S0 W1 E1   S,W,E,N
Elf Nr.   19 T   16009 -> 17009 S MOVE   N0 S0 W1 E0   S,W,E,N
Elf Nr.   20 U   18004 -> 18004 -  --    N0 S0 W0 E0   S,W,E,N
Elf Nr.   21 V   18007 -> 18007 -  --    N0 S0 W0 E0   S,W,E,N

count_moved_elfs 11

     0123456789012345          0123456789012345
  0  .......A........       0  .......A........
  1  .....B...E......       1  ....B.....E.....
  2  ...F..C.D.......       2  ...F..C.D.......
  3  .......G..H.....       3  .......G...H....
  4  ....I.N.JK......       4  ...I..N.J.......
  5  ..L..M.O........       5  .L...M.O.K......
  6  ..P.Q.R.ST......       6  ................
  7  ................       7  ..P.Q.R.ST......
  8  ....U..V........       8  ....U..V........
  9  ................       9  ................
 10  ................      10  ................
 11  ................      11  ................

--------------------------------------------------------------------------------
Loop Nr. 3

Elf Nr.    0 A   10007 -> 10007 -  --    N0 S0 W0 E0   W,E,N,S
Elf Nr.    1 B   11004 -> 11005 E MOVE   N0 S1 W1 E0   W,E,N,S
Elf Nr.    2 C   12006 -> 12005 W MOVE   N0 S1 W0 E1   W,E,N,S
Elf Nr.    3 D   12008 -> 12009 E MOVE   N0 S1 W1 E0   W,E,N,S
Elf Nr.    4 E   11010 -> 11010 -  --    N0 S0 W0 E0   W,E,N,S
Elf Nr.    5 F   12003 -> 12002 W MOVE   N1 S0 W0 E1   W,E,N,S
Elf Nr.    6 G   13007 -> 13007 -  --    N2 S2 W2 E2   W,E,N,S
Elf Nr.    7 H   13011 -> 13011 -  --    N0 S0 W0 E0   W,E,N,S
Elf Nr.    8 I   14003 -> 14003 -  --    N0 S0 W0 E0   W,E,N,S
Elf Nr.    9 J   14008 -> 14008 -  --    N1 S2 W2 E1   W,E,N,S
Elf Nr.   10 K   15009 -> 15010 E MOVE   N1 S0 W1 E0   W,E,N,S
Elf Nr.   11 L   15001 -> 15001 -  --    N0 S0 W0 E0   W,E,N,S
Elf Nr.   12 M   15005 -> 15004 W MOVE   N1 S0 W0 E1   W,E,N,S
Elf Nr.   13 N   14006 -> 14006 -  --    N1 S2 W1 E2   W,E,N,S
Elf Nr.   14 O   15007 -> 16007 S MOVE   N2 S0 W1 E1   W,E,N,S
Elf Nr.   15 P   17002 -> 17002 -  --    N0 S0 W0 E0   W,E,N,S
Elf Nr.   16 Q   17004 -> 17003 W MOVE   N0 S1 W0 E0   W,E,N,S
Elf Nr.   17 R   17006 -> 17005 W MOVE   N0 S1 W0 E1   W,E,N,S
Elf Nr.   18 S   17008 -> 16008 N MOVE   N0 S1 W1 E1   W,E,N,S
Elf Nr.   19 T   17009 -> 17010 E MOVE   N0 S0 W1 E0   W,E,N,S
Elf Nr.   20 U   18004 -> 18003 W MOVE   N1 S0 W0 E0   W,E,N,S
Elf Nr.   21 V   18007 -> 19007 S MOVE   N2 S0 W1 E1   W,E,N,S

count_moved_elfs 13

     0123456789012345          0123456789012345
  0  .......A........       0  .......A........
  1  ....B.....E.....       1  .....B....E.....
  2  ...F..C.D.......       2  ..F..C...D......
  3  .......G...H....       3  .......G...H....
  4  ...I..N.J.......       4  ...I..N.J.......
  5  .L...M.O.K......       5  .L..M.....K.....
  6  ................       6  .......OS.......
  7  ..P.Q.R.ST......       7  ..PQ.R....T.....
  8  ....U..V........       8  ...U............
  9  ................       9  .......V........
 10  ................      10  ................
 11  ................      11  ................

--------------------------------------------------------------------------------
Loop Nr. 4

Elf Nr.    0 A   10007 -> 10007 -  --    N0 S0 W0 E0   E,N,S,W
Elf Nr.    1 B   11005 -> 11006 E MOVE   N0 S1 W0 E0   E,N,S,W
Elf Nr.    2 C   12005 -> 12006 E MOVE   N1 S0 W0 E0   E,N,S,W
Elf Nr.    3 D   12009 -> 13009 S MOVE   N1 S0 W0 E1   E,N,S,W
Elf Nr.    4 E   11010 -> 11011 E MOVE   N0 S1 W1 E0   E,N,S,W
Elf Nr.    5 F   12002 -> 12002 -  --    N0 S0 W0 E0   E,N,S,W
Elf Nr.    6 G   13007 -> 12007 N MOVE   N0 S2 W1 E1   E,N,S,W
Elf Nr.    7 H   13011 -> 13011 -  --    N0 S0 W0 E0   E,N,S,W
Elf Nr.    8 I   14003 -> 13003 N MOVE   N0 S1 W0 E1   E,N,S,W
Elf Nr.    9 J   14008 -> 14009 E MOVE   N1 S0 W1 E0   E,N,S,W
Elf Nr.   10 K   15010 -> 15010 -  --    N0 S0 W0 E0   E,N,S,W
Elf Nr.   11 L   15001 -> 15001 -  --    N0 S0 W0 E0   E,N,S,W
Elf Nr.   12 M   15004 -> 15005 E MOVE   N1 S0 W1 E0   E,N,S,W
Elf Nr.   13 N   14006 -> 15006 S MOVE   N1 S0 W0 E1   E,N,S,W
Elf Nr.   14 O   16007 -> 15007 N MOVE   N0 S0 W0 E1   E,N,S,W
Elf Nr.   15 P   17002 -> 16002 N MOVE   N0 S1 W0 E2   E,N,S,W
Elf Nr.   16 Q   17003 -> 17004 E MOVE   N0 S1 W1 E0   E,N,S,W
Elf Nr.   17 R   17005 -> 17005 -  --    N0 S0 W0 E0   E,N,S,W
Elf Nr.   18 S   16008 -> 16009 E MOVE   N0 S0 W1 E0   E,N,S,W
Elf Nr.   19 T   17010 -> 17010 -  --    N0 S0 W0 E0   E,N,S,W
Elf Nr.   20 U   18003 -> 18004 E MOVE   N2 S0 W1 E0   E,N,S,W
Elf Nr.   21 V   19007 -> 19007 -  --    N0 S0 W0 E0   E,N,S,W

count_moved_elfs 14

     0123456789012345          0123456789012345
  0  .......A........       0  .......A........
  1  .....B....E.....       1  ......B....E....
  2  ..F..C...D......       2  ..F...CG........
  3  .......G...H....       3  ...I.....D.H....
  4  ...I..N.J.......       4  .........J......
  5  .L..M.....K.....       5  .L...MNO..K.....
  6  .......OS.......       6  ..P......S......
  7  ..PQ.R....T.....       7  ....QR....T.....
  8  ...U............       8  ....U...........
  9  .......V........       9  .......V........
 10  ................      10  ................
 11  ................      11  ................

--------------------------------------------------------------------------------
Loop Nr. 5

Elf Nr.    0 A   10007 -> 10008 E MOVE   N0 S1 W1 E0   N,S,W,E
Elf Nr.    1 B   11006 -> 11005 W MOVE   N1 S2 W0 E2   N,S,W,E
Elf Nr.    2 C   12006 -> 13006 S MOVE   N1 S0 W0 E1   N,S,W,E
Elf Nr.    3 D   13009 -> 12009 N MOVE   N0 S1 W0 E0   N,S,W,E
Elf Nr.    4 E   11011 -> 11011 -  --    N0 S0 W0 E0   N,S,W,E
Elf Nr.    5 F   12002 -> 11002 N MOVE   N0 S1 W0 E1   N,S,W,E
Elf Nr.    6 G   12007 -> 13007 S MOVE   N1 S0 W2 E0   N,S,W,E
Elf Nr.    7 H   13011 -> 13011 -  --    N0 S0 W0 E0   N,S,W,E
Elf Nr.    8 I   13003 -> 14003 S MOVE   N1 S0 W1 E0   N,S,W,E
Elf Nr.    9 J   14009 -> 14008 W MOVE   N1 S1 W0 E1   N,S,W,E
Elf Nr.   10 K   15010 -> 15011 E MOVE   N1 S1 W2 E0   N,S,W,E
Elf Nr.   11 L   15001 -> 14001 N MOVE   N0 S1 W0 E1   N,S,W,E
Elf Nr.   12 M   15005 -> 14005 N MOVE   N0 S0 W0 E1   N,S,W,E
Elf Nr.   13 N   15006 -> 14006 N MOVE   N0 S0 W1 E1   N,S,W,E
Elf Nr.   14 O   15007 -> 14007 N MOVE   N0 S0 W1 E0   N,S,W,E
Elf Nr.   15 P   16002 -> 17002 S MOVE   N1 S0 W1 E0   N,S,W,E
Elf Nr.   16 Q   17004 -> 16004 N MOVE   N0 S1 W0 E1   N,S,W,E
Elf Nr.   17 R   17005 -> 16005 N MOVE   N0 S1 W2 E0   N,S,W,E
Elf Nr.   18 S   16009 -> 16008 W MOVE   N1 S1 W0 E2   N,S,W,E
Elf Nr.   19 T   17010 -> 18010 S MOVE   N1 S0 W1 E0   N,S,W,E
Elf Nr.   20 U   18004 -> 19004 S MOVE   N2 S0 W0 E1   N,S,W,E
Elf Nr.   21 V   19007 -> 19007 -  --    N0 S0 W0 E0   N,S,W,E

count_moved_elfs 19

     0123456789012345          0123456789012345
  0  .......A........       0  ........A.......
  1  ......B....E....       1  ..F..B.....E....
  2  ..F...CG........       2  .........D......
  3  ...I.....D.H....       3  ......CG...H....
  4  .........J......       4  .L.I.MNOJ.......
  5  .L...MNO..K.....       5  ...........K....
  6  ..P......S......       6  ....QR..S.......
  7  ....QR....T.....       7  ..P.............
  8  ....U...........       8  ..........T.....
  9  .......V........       9  ....U..V........
 10  ................      10  ................
 11  ................      11  ................

--------------------------------------------------------------------------------
Loop Nr. 6

Elf Nr.    0 A   10008 -> 10008 -  --    N0 S0 W0 E0   S,W,E,N
Elf Nr.    1 B   11005 -> 11005 -  --    N0 S0 W0 E0   S,W,E,N
Elf Nr.    2 C   13006 -> 12006 N MOVE   N0 S3 W1 E2   S,W,E,N
Elf Nr.    3 D   12009 -> 12009 -  --    N0 S0 W0 E0   S,W,E,N
Elf Nr.    4 E   11011 -> 11011 -  --    N0 S0 W0 E0   S,W,E,N
Elf Nr.    5 F   11002 -> 11002 -  --    N0 S0 W0 E0   S,W,E,N
Elf Nr.    6 G   13007 -> 12007 N MOVE   N0 S3 W2 E1   S,W,E,N
Elf Nr.    7 H   13011 -> 13011 -  --    N0 S0 W0 E0   S,W,E,N
Elf Nr.    8 I   14003 -> 14003 -  --    N0 S0 W0 E0   S,W,E,N
Elf Nr.    9 J   14008 -> 15008 S MOVE   N1 S0 W2 E0   S,W,E,N
Elf Nr.   10 K   15011 -> 15011 -  --    N0 S0 W0 E0   S,W,E,N
Elf Nr.   11 L   14001 -> 14001 -  --    N0 S0 W0 E0   S,W,E,N
Elf Nr.   12 M   14005 -> 15005 S MOVE   N1 S0 W0 E2   S,W,E,N
Elf Nr.   13 N   14006 -> 15006 S MOVE   N2 S0 W1 E2   S,W,E,N
Elf Nr.   14 O   14007 -> 15007 S MOVE   N2 S0 W2 E1   S,W,E,N
Elf Nr.   15 P   17002 -> 17002 -  --    N0 S0 W0 E0   S,W,E,N
Elf Nr.   16 Q   16004 -> 17004 S MOVE   N0 S0 W0 E1   S,W,E,N
Elf Nr.   17 R   16005 -> 17005 S MOVE   N0 S0 W1 E0   S,W,E,N
Elf Nr.   18 S   16008 -> 16008 -  --    N0 S0 W0 E0   S,W,E,N
Elf Nr.   19 T   18010 -> 18010 -  --    N0 S0 W0 E0   S,W,E,N
Elf Nr.   20 U   19004 -> 19004 -  --    N0 S0 W0 E0   S,W,E,N
Elf Nr.   21 V   19007 -> 19007 -  --    N0 S0 W0 E0   S,W,E,N

count_moved_elfs 8

     0123456789012345          0123456789012345
  0  ........A.......       0  ........A.......
  1  ..F..B.....E....       1  ..F..B.....E....
  2  .........D......       2  ......CG.D......
  3  ......CG...H....       3  ...........H....
  4  .L.I.MNOJ.......       4  .L.I............
  5  ...........K....       5  .....MNOJ..K....
  6  ....QR..S.......       6  ........S.......
  7  ..P.............       7  ..P.QR..........
  8  ..........T.....       8  ..........T.....
  9  ....U..V........       9  ....U..V........
 10  ................      10  ................
 11  ................      11  ................

--------------------------------------------------------------------------------
Loop Nr. 7

Elf Nr.    0 A   10008 -> 10008 -  --    N0 S0 W0 E0   W,E,N,S
Elf Nr.    1 B   11005 -> 11004 W MOVE   N0 S1 W0 E1   W,E,N,S
Elf Nr.    2 C   12006 -> 13006 S MOVE   N1 S0 W1 E1   W,E,N,S
Elf Nr.    3 D   12009 -> 12009 -  --    N0 S0 W0 E0   W,E,N,S
Elf Nr.    4 E   11011 -> 11011 -  --    N0 S0 W0 E0   W,E,N,S
Elf Nr.    5 F   11002 -> 11002 -  --    N0 S0 W0 E0   W,E,N,S
Elf Nr.    6 G   12007 -> 12008 E MOVE   N0 S0 W1 E0   W,E,N,S
Elf Nr.    7 H   13011 -> 13011 -  --    N0 S0 W0 E0   W,E,N,S
Elf Nr.    8 I   14003 -> 14003 -  --    N0 S0 W0 E0   W,E,N,S
Elf Nr.    9 J   15008 -> 15009 E MOVE   N0 S1 W1 E0   W,E,N,S
Elf Nr.   10 K   15011 -> 15011 -  --    N0 S0 W0 E0   W,E,N,S
Elf Nr.   11 L   14001 -> 14001 -  --    N0 S0 W0 E0   W,E,N,S
Elf Nr.   12 M   15005 -> 15004 W MOVE   N0 S0 W0 E1   W,E,N,S
Elf Nr.   13 N   15006 -> 14006 N MOVE   N0 S0 W1 E1   W,E,N,S
Elf Nr.   14 O   15007 -> 14007 N MOVE   N0 S1 W1 E2   W,E,N,S
Elf Nr.   15 P   17002 -> 17002 -  --    N0 S0 W0 E0   W,E,N,S
Elf Nr.   16 Q   17004 -> 17003 W MOVE   N0 S0 W0 E1   W,E,N,S
Elf Nr.   17 R   17005 -> 17006 E MOVE   N0 S0 W1 E0   W,E,N,S
Elf Nr.   18 S   16008 -> 16009 E MOVE   N2 S0 W1 E0   W,E,N,S
Elf Nr.   19 T   18010 -> 18010 -  --    N0 S0 W0 E0   W,E,N,S
Elf Nr.   20 U   19004 -> 19004 -  --    N0 S0 W0 E0   W,E,N,S
Elf Nr.   21 V   19007 -> 19007 -  --    N0 S0 W0 E0   W,E,N,S

count_moved_elfs 10

     0123456789012345          0123456789012345
  0  ........A.......       0  ........A.......
  1  ..F..B.....E....       1  ..F.B......E....
  2  ......CG.D......       2  ........GD......
  3  ...........H....       3  ......C....H....
  4  .L.I............       4  .L.I..NO........
  5  .....MNOJ..K....       5  ....M....J.K....
  6  ........S.......       6  .........S......
  7  ..P.QR..........       7  ..PQ..R.........
  8  ..........T.....       8  ..........T.....
  9  ....U..V........       9  ....U..V........
 10  ................      10  ................
 11  ................      11  ................

--------------------------------------------------------------------------------
Loop Nr. 8

Elf Nr.    0 A   10008 -> 10008 -  --    N0 S0 W0 E0   E,N,S,W
Elf Nr.    1 B   11004 -> 11004 -  --    N0 S0 W0 E0   E,N,S,W
Elf Nr.    2 C   13006 -> 12006 N MOVE   N0 S2 W0 E1   E,N,S,W
Elf Nr.    3 D   12009 -> 12010 E MOVE   N0 S0 W1 E0   E,N,S,W
Elf Nr.    4 E   11011 -> 11011 -  --    N0 S0 W0 E0   E,N,S,W
Elf Nr.    5 F   11002 -> 11002 -  --    N0 S0 W0 E0   E,N,S,W
Elf Nr.    6 G   12008 -> 11008 N MOVE   N0 S0 W0 E1   E,N,S,W
Elf Nr.    7 H   13011 -> 13011 -  --    N0 S0 W0 E0   E,N,S,W
Elf Nr.    8 I   14003 -> 13003 N MOVE   N0 S1 W0 E1   E,N,S,W
Elf Nr.    9 J   15009 -> 15010 E MOVE   N0 S1 W0 E0   E,N,S,W
Elf Nr.   10 K   15011 -> 15011 -  --    N0 S0 W0 E0   E,N,S,W
Elf Nr.   11 L   14001 -> 14001 -  --    N0 S0 W0 E0   E,N,S,W
Elf Nr.   12 M   15004 -> 15005 E MOVE   N1 S0 W1 E0   E,N,S,W
Elf Nr.   13 N   14006 -> 15006 S MOVE   N1 S0 W0 E1   E,N,S,W
Elf Nr.   14 O   14007 -> 14008 E MOVE   N1 S0 W2 E0   E,N,S,W
Elf Nr.   15 P   17002 -> 16002 N MOVE   N0 S0 W0 E1   E,N,S,W
Elf Nr.   16 Q   17003 -> 17004 E MOVE   N0 S0 W1 E0   E,N,S,W
Elf Nr.   17 R   17006 -> 17006 -  --    N0 S0 W0 E0   E,N,S,W
Elf Nr.   18 S   16009 -> 16010 E MOVE   N1 S0 W0 E0   E,N,S,W
Elf Nr.   19 T   18010 -> 18010 -  --    N0 S0 W0 E0   E,N,S,W
Elf Nr.   20 U   19004 -> 19004 -  --    N0 S0 W0 E0   E,N,S,W
Elf Nr.   21 V   19007 -> 19007 -  --    N0 S0 W0 E0   E,N,S,W

count_moved_elfs 11

     0123456789012345          0123456789012345
  0  ........A.......       0  ........A.......
  1  ..F.B......E....       1  ..F.B...G..E....
  2  ........GD......       2  ......C...D.....
  3  ......C....H....       3  ...I.......H....
  4  .L.I..NO........       4  .L......O.......
  5  ....M....J.K....       5  .....MN...JK....
  6  .........S......       6  ..P.......S.....
  7  ..PQ..R.........       7  ....Q.R.........
  8  ..........T.....       8  ..........T.....
  9  ....U..V........       9  ....U..V........
 10  ................      10  ................
 11  ................      11  ................

--------------------------------------------------------------------------------
Loop Nr. 9

Elf Nr.    0 A   10008 -> 10007 W MOVE   N0 S1 W0 E0   N,S,W,E
Elf Nr.    1 B   11004 -> 11004 -  --    N0 S0 W0 E0   N,S,W,E
Elf Nr.    2 C   12006 -> 12006 -  --    N0 S0 W0 E0   N,S,W,E
Elf Nr.    3 D   12010 -> 12009 W MOVE   N1 S1 W0 E2   N,S,W,E
Elf Nr.    4 E   11011 -> 10011 N MOVE   N0 S1 W1 E0   N,S,W,E
Elf Nr.    5 F   11002 -> 11002 -  --    N0 S0 W0 E0   N,S,W,E
Elf Nr.    6 G   11008 -> 12008 S MOVE   N1 S0 W0 E0   N,S,W,E
Elf Nr.    7 H   13011 -> 14011 S MOVE   N1 S0 W1 E0   N,S,W,E
Elf Nr.    8 I   13003 -> 13003 -  --    N0 S0 W0 E0   N,S,W,E
Elf Nr.    9 J   15010 -> 14010 N MOVE   N0 S1 W0 E1   N,S,W,E
Elf Nr.   10 K   15011 -> 14011 N MOVE   N0 S1 W2 E0   N,S,W,E
Elf Nr.   11 L   14001 -> 14001 -  --    N0 S0 W0 E0   N,S,W,E
Elf Nr.   12 M   15005 -> 14005 N MOVE   N0 S0 W0 E1   N,S,W,E
Elf Nr.   13 N   15006 -> 14006 N MOVE   N0 S0 W1 E0   N,S,W,E
Elf Nr.   14 O   14008 -> 14008 -  --    N0 S0 W0 E0   N,S,W,E
Elf Nr.   15 P   16002 -> 16002 -  --    N0 S0 W0 E0   N,S,W,E
Elf Nr.   16 Q   17004 -> 17004 -  --    N0 S0 W0 E0   N,S,W,E
Elf Nr.   17 R   17006 -> 17006 -  --    N0 S0 W0 E0   N,S,W,E
Elf Nr.   18 S   16010 -> 17010 S MOVE   N2 S0 W0 E1   N,S,W,E
Elf Nr.   19 T   18010 -> 18010 -  --    N0 S0 W0 E0   N,S,W,E
Elf Nr.   20 U   19004 -> 19004 -  --    N0 S0 W0 E0   N,S,W,E
Elf Nr.   21 V   19007 -> 19007 -  --    N0 S0 W0 E0   N,S,W,E

count_moved_elfs 8

     0123456789012345          0123456789012345
  0  ........A.......       0  .......A...E....
  1  ..F.B...G..E....       1  ..F.B...........
  2  ......C...D.....       2  ......C.GD......
  3  ...I.......H....       3  ...I.......H....
  4  .L......O.......       4  .L...MN.O.J.....
  5  .....MN...JK....       5  ...........K....
  6  ..P.......S.....       6  ..P.............
  7  ....Q.R.........       7  ....Q.R...S.....
  8  ..........T.....       8  ..........T.....
  9  ....U..V........       9  ....U..V........
 10  ................      10  ................
 11  ................      11  ................

--------------------------------------------------------------------------------
Loop Nr. 10

Elf Nr.    0 A   10007 -> 10007 -  --    N0 S0 W0 E0   S,W,E,N
Elf Nr.    1 B   11004 -> 11004 -  --    N0 S0 W0 E0   S,W,E,N
Elf Nr.    2 C   12006 -> 12006 -  --    N0 S0 W0 E0   S,W,E,N
Elf Nr.    3 D   12009 -> 13009 S MOVE   N0 S0 W1 E0   S,W,E,N
Elf Nr.    4 E   10011 -> 10011 -  --    N0 S0 W0 E0   S,W,E,N
Elf Nr.    5 F   11002 -> 11002 -  --    N0 S0 W0 E0   S,W,E,N
Elf Nr.    6 G   12008 -> 13008 S MOVE   N0 S0 W0 E1   S,W,E,N
Elf Nr.    7 H   13011 -> 13012 E MOVE   N0 S1 W1 E0   S,W,E,N
Elf Nr.    8 I   13003 -> 13003 -  --    N0 S0 W0 E0   S,W,E,N
Elf Nr.    9 J   14010 -> 14009 W MOVE   N1 S1 W0 E2   S,W,E,N
Elf Nr.   10 K   15011 -> 16011 S MOVE   N1 S0 W1 E0   S,W,E,N
Elf Nr.   11 L   14001 -> 14001 -  --    N0 S0 W0 E0   S,W,E,N
Elf Nr.   12 M   14005 -> 15005 S MOVE   N0 S0 W0 E1   S,W,E,N
Elf Nr.   13 N   14006 -> 15006 S MOVE   N0 S0 W1 E0   S,W,E,N
Elf Nr.   14 O   14008 -> 14008 -  --    N0 S0 W0 E0   S,W,E,N
Elf Nr.   15 P   16002 -> 16002 -  --    N0 S0 W0 E0   S,W,E,N
Elf Nr.   16 Q   17004 -> 17004 -  --    N0 S0 W0 E0   S,W,E,N
Elf Nr.   17 R   17006 -> 17006 -  --    N0 S0 W0 E0   S,W,E,N
Elf Nr.   18 S   17010 -> 17009 W MOVE   N0 S1 W0 E0   S,W,E,N
Elf Nr.   19 T   18010 -> 19010 S MOVE   N1 S0 W0 E0   S,W,E,N
Elf Nr.   20 U   19004 -> 19004 -  --    N0 S0 W0 E0   S,W,E,N
Elf Nr.   21 V   19007 -> 19007 -  --    N0 S0 W0 E0   S,W,E,N

count_moved_elfs 9

     0123456789012345          0123456789012345          123456789012
  0  .......A...E....       0  .......A...E....       0  ......A...E.
  1  ..F.B...........       1  ..F.B...........       1  .F.B........
  2  ......C.GD......       2  ......C.........       2  .....C......
  3  ...I.......H....       3  ...I....GD..H...       3  ..I....GD..H
  4  .L...MN.O.J.....       4  .L......OJ......       4  L......OJ...
  5  ...........K....       5  .....MN.........       5  ....MN......
  6  ..P.............       6  ..P........K....       6  .P........K.
  7  ....Q.R...S.....       7  ....Q.R..S......       7  ...Q.R..S...
  8  ..........T.....       8  ................       8  ............
  9  ....U..V........       9  ....U..V..T.....       9  ...U..V..T..
 10  ................      10  ................
 11  ................      11  ................

rect_row_min =>0<
rect_col_min =>1<
rect_row_max =>9<
rect_col_max =>12<

Result Part 1 = 98
Result Part 2 = 0

Day 23 - End

 */