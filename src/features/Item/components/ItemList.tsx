import useItems from '@/utils/hooks/useItems'
import ItemCard from './ItemCard'

const ItemList = () => {
    const { data: items, error } = useItems(10)

    if (error) return <p>{error.message}</p>

    return (
        <>
            <div>
                <p>List Items</p>

                <ul>
                    {items?.map((item) => (
                        <ItemCard key={item.id} item={item} />
                    ))}
                </ul>
            </div >
        </>
    )
}

export default ItemList