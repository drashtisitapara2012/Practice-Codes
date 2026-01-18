import { Chilanka } from "next/font/google"
import { Children } from "react"

export default function ProductLayout ({
    Children,
}: {
    Children: React.ReactNode;
}) {
    return (
    <div>{Children}
    <h2>Featured products section</h2>
    </div>
    );
}