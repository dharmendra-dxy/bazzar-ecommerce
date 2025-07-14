import React from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps{
    currentPage: number,
    totalPages: number,
    setCurrentPage: any,
}

const Pagination:React.FC<PaginationProps> = ({ currentPage, totalPages,setCurrentPage }) => {

    // hanlePageChange:
    const hanlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    }

    return (
        <div className="mt-10 items-center flex justify-center gap-2 ">
            {/* Left Button */}
            <Button
                variant={'outline'}
                size={'icon'}
                disabled={currentPage === 1}
                onClick={() => hanlePageChange(Math.max(1, currentPage - 1))}

            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Render buttons for all pages: */}
            {
                Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
                    <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        className="w-10"
                        onClick={() => hanlePageChange(page)}
                    >
                        {page}
                    </Button>
                ))
            }


            {/* Right Button */}
            <Button
                variant={'outline'}
                size={'icon'}
                disabled={currentPage === totalPages}
                onClick={() => hanlePageChange(Math.min(totalPages, currentPage + 1))}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>

        </div>
    );
};

export default Pagination;
