import { useEffect, useState } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  Tags,
  X,
  Save,
  LoaderCircle,
} from 'lucide-react'

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../../services/adminSettingsService'

const initialForm = {
  name: '',
  description: '',
}

const AdminCategories = () => {
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState(initialForm)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const [editingId, setEditingId] = useState(null)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getCategories()
      setCategories(data)
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to load categories.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const openAddModal = () => {
    setEditingId(null)
    setFormData(initialForm)
    setError('')
    setShowModal(true)
  }

  const openEditModal = (category) => {
    setEditingId(category.id)

    setFormData({
      name: category.name || '',
      description: category.description || '',
    })

    setError('')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingId(null)
    setFormData(initialForm)
    setError('')
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))

    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
    }

    if (!payload.name) {
      setError('Category name is required.')
      return
    }

    try {
      setSaving(true)

      if (editingId) {
        await updateCategory(editingId, payload)
        setSuccess('Category updated successfully!')
      } else {
        await createCategory(payload)
        setSuccess('Category created successfully!')
      }

      closeModal()
      await fetchCategories()
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to save category. Please try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (category) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    )

    if (!confirmed) return

    setError('')
    setSuccess('')

    try {
      await deleteCategory(category.id)

      setSuccess('Category deleted successfully!')
      await fetchCategories()
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to delete category. It may be assigned to existing courses.'
      )
    }
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-100 p-3">
            <Tags className="text-indigo-600" size={22} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Course Categories
            </h2>

            <p className="text-sm text-gray-500">
              Organize courses into manageable categories.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* Messages */}
      {error && !showModal && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Categories Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-gray-500">
            <LoaderCircle size={20} className="animate-spin" />
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="py-12 text-center">
            <Tags size={35} className="mx-auto mb-3 text-gray-300" />

            <h3 className="font-medium text-gray-700">
              No categories found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Add your first course category to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                    Description
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {categories.map((category) => (
                  <tr
                    key={category.id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-indigo-50 p-2">
                          <Tags
                            size={17}
                            className="text-indigo-600"
                          />
                        </div>

                        <span className="font-medium text-gray-800">
                          {category.name}
                        </span>
                      </div>
                    </td>

                    <td className="max-w-sm px-6 py-4 text-sm text-gray-500">
                      {category.description || 'No description'}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(category)}
                          title="Edit category"
                          className="rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(category)}
                          title="Delete category"
                          className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {editingId ? 'Edit Category' : 'Add Category'}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Enter the category information below.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label
                  htmlFor="categoryName"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Category Name
                </label>

                <input
                  id="categoryName"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  maxLength={60}
                  required
                  placeholder="e.g. Java Development"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label
                  htmlFor="categoryDescription"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Description
                </label>

                <textarea
                  id="categoryDescription"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  maxLength={250}
                  placeholder="Describe this category..."
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

                <p className="mt-1 text-right text-xs text-gray-400">
                  {formData.description.length}/250 characters
                </p>
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={16} />
                  {saving
                    ? 'Saving...'
                    : editingId
                      ? 'Update Category'
                      : 'Create Category'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCategories