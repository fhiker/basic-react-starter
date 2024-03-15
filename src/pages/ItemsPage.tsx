import ItemList from '@/features/Item/components/ItemList'
import CreateItem from '@/components/CreateItem/CreateItem'
import { createContext, useState } from 'react'
import { Item } from '@/features/Item/types/types'
import EditItem from '@/components/EditItem/EditItem'
import Layout from '@/Layout'

type contextType = {
    currentItem: Item | undefined
    setCurrentItem: React.Dispatch<React.SetStateAction<Item>>
    setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const currentItemContext = createContext<contextType>({ setCurrentItem: () => { }, setIsEditModalOpen: () => { }, currentItem: undefined })

const ItemsPage = () => {
    const defaultItem: Item | null = { title: '', size: 0, id: '0' }
    const [isCreateItemModalOpen, setIsCreateItemModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [currentItem, setCurrentItem] = useState(defaultItem)

    return (
        <>
            <currentItemContext.Provider value={{ currentItem, setCurrentItem, setIsEditModalOpen }}>
                <Layout>
                    <div>
                        <div>
                            <ItemList />
                        </div>
                        <div>
                            <button aria-label='add-button' type='button' onClick={() => setIsCreateItemModalOpen(!isCreateItemModalOpen)}>Add</button>
                        </div>
                        {isCreateItemModalOpen && <div className='modal'>
                            <CreateItem onClose={() => setIsCreateItemModalOpen(false)} />
                        </div>}
                        {isEditModalOpen && <div className='modal'>
                            <EditItem />
                        </div>
                        }

                    </div>
                </Layout>
            </currentItemContext.Provider>

        </>
    )
}

export default ItemsPage