import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Navbar from "./Navbar";
import '@testing-library/jest-dom/vitest'

describe('navbar', () => {

    it('should show navbar', () => {
        render(<Navbar />)

        expect(screen.getByText('Navbar')).toBeInTheDocument()
    })
})