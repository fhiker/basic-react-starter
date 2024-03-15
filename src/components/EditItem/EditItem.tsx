import { updateItemSchema } from '@/features/Item/validation'
import { currentItemContext } from '@/pages/ItemsPage'
import validate from '@/utils/functions/validate'
import useUpdateItem from '@/utils/hooks/useEditItem'
import { ChangeEvent, useContext, useState } from 'react'
import { z } from 'zod'

type FormFieldsType = Record<keyof z.infer<typeof updateItemSchema>, string>

const EditItem = () => {
  const { currentItem, setIsEditModalOpen } = useContext(currentItemContext)
  const formDefaultValues = { title: currentItem?.title || '', size: currentItem?.size.toString() || '' }
  const formDefaultErrors = { title: '', size: '' }


  const [formValues, setFormValues] = useState<FormFieldsType>(formDefaultValues)
  const [formErrors, setFormErrors] = useState<FormFieldsType>(formDefaultErrors)

  const updateItem = useUpdateItem()

  function handleChange(e: ChangeEvent<HTMLInputElement>): void {

    setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleBlur(e: ChangeEvent<HTMLInputElement>): void {
    const validatedData = validate<typeof updateItemSchema>(formValues, updateItemSchema)
    const found = validatedData.errors.find(i => i.path.join('.') === e.target.name)
    if (found) {
      setFormErrors({ ...formErrors, [e.target.name]: found.message })
    } else {
      setFormErrors({ ...formErrors, [e.target.name]: '' })
    }

  }

  function handleSubmit(e: { preventDefault: () => void; }) {
    e.preventDefault()
    if (!currentItem) {
      return;
    }

    const validatedData = validate<typeof updateItemSchema>(formValues, updateItemSchema)

    setFormErrors(formDefaultValues)

    if (validatedData.errors.length > 0) {
      const newErrors: Record<string, string> = {}

      for (const error of validatedData.errors) {
        const errTitle = error.path.join('.')
        newErrors[errTitle] = error.message
      }
      setFormErrors({ ...formErrors, ...newErrors })

      return
    }

    const data = {
      item: currentItem,
      data: validatedData.data
    }
    try {
      updateItem.mutate(data)
      setFormValues(formDefaultValues)
      setIsEditModalOpen(false)

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      Edit item
      <form role='form' aria-label='edit-item-form' onSubmit={handleSubmit}>
        <div>
          <label>
            <div>
              Title:
            </div>
            <input
              aria-label='title'
              type="text"
              name="title"
              value={formValues.title}
              onChange={handleChange}
              onBlur={handleBlur}
            />

          </label>

        </div>
        {formErrors.title && <span aria-label="title-error" className="error">Error: {formErrors.title}</span>}
        <div>
          <label>
            <div>
              Size:
            </div>
            <input
              aria-label='size'
              name="size"
              value={formValues.size}
              type="number"
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </label>
        </div>
        {formErrors.size && <span aria-label="size-error" className="error">Error: {formErrors.size}</span>}
        <div>
          <input aria-label='submit' type="submit" value="Submit" />
        </div>

      </form>
    </div>

  )
}

export default EditItem