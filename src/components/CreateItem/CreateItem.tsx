import validate from "@/utils/functions/validate";
import { createItemSchema } from "@/features/Item/validation";
import { ChangeEvent, useState } from "react";
import { z } from "zod";
import useCreateItem from "@/utils/hooks/useCreateItem";

type FormFieldsType = Record<keyof z.infer<typeof createItemSchema>, string>

const CreateItem = ({ onClose }: { onClose: () => void }) => {
    const formDefaultValues = { title: '', size: '' }
    const [formValues, setFormValues] = useState<FormFieldsType>(formDefaultValues)
    const [formErrors, setFormErrors] = useState<FormFieldsType>(formDefaultValues)
    const createItem = useCreateItem()

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    function handleBlur(e: { target: { name: string | number; }; }) {
        const validatedData = validate<typeof createItemSchema>(formValues, createItemSchema)
        const found = validatedData.errors.find(i => i.path.join('.') === e.target.name)
        if (found) {
            setFormErrors({ ...formErrors, [e.target.name]: found.message })
        } else {
            setFormErrors({ ...formErrors, [e.target.name]: '' })
        }
    }

    async function handleSubmit(e: { preventDefault: () => void; }) {
        e.preventDefault()

        const validatedData = validate<typeof createItemSchema>(formValues, createItemSchema)

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

        try {
            createItem.mutate(validatedData.data)

            setFormValues(formDefaultValues)

        } catch (error) {
            console.log(error)
        }
        onClose()
    }

    return (
        <div>
            Create new item
            <form role="form" aria-label="create-item-form" onSubmit={handleSubmit}>
                <div>
                    <label>
                        <div>
                            Title:
                        </div>
                        <input
                            type="text"
                            name="title"
                            aria-label="title"
                            value={formValues.title}
                            onChange={handleChange}
                            onBlur={handleBlur} />

                    </label>

                </div>
                {formErrors.title && <span aria-label="title-error" className="error">Error: {formErrors.title}</span>}
                <div>
                    <label >
                        <div>
                            Size:
                        </div>
                        <input
                            aria-label="size"
                            name="size"
                            value={formValues.size}
                            type="number"
                            onChange={handleChange}
                            onBlur={handleBlur} />
                    </label>
                </div>
                {formErrors.size && <span aria-label="size-error" className="error">Error: {formErrors.size}</span>}
                <div>
                    <input aria-label="submit" type="submit" value="Submit" />
                </div>

            </form>
        </div>

    )
}

export default CreateItem