import { useContext } from 'react'
import { Item } from '../types/types'
import { currentItemContext } from '@/pages/ItemsPage';
import useDeleteItem from '@/utils/hooks/useDeleteItem';

const ItemCard = ({ item }: { item: Item }) => {
    const { setCurrentItem, setIsEditModalOpen } = useContext(currentItemContext);
    const deleteItem = useDeleteItem()
    function onEditClick() {
        setCurrentItem(item)
        setIsEditModalOpen(true)
    }
    function onDeleteClick() {
        deleteItem.mutate(item)
    }

    return (
        <div aria-label='item-card' key={item.id} className='card'>
            <div aria-label='content'>
                <span>Name:</span><span> {item.title}</span>
                ,
                <span>Size:</span><span> {item.size}</span>
                &nbsp;&nbsp;&nbsp;
                <button aria-label='edit-button' type='button' onClick={onEditClick}>Edit</button>
                <button aria-label='delete-button' type='button' onClick={onDeleteClick}>Delete</button>
            </div>
        </div>
    )
}

export default ItemCard