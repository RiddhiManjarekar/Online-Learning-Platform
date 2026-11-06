import { useEffect, useState } from 'react'
import { Save, UserRound } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext'
import {
  getAdminProfile,
  updateAdminProfile,
} from '../../../services/adminSettingsService'

const AdminProfileForm = () => {
  const { user, updateUser } = useAuth()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError('')

        const profile = await getAdminProfile()

        setFormData({
          name: profile.name || '',
          email: profile.email || '',
        })
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Unable to load admin profile.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))

    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    const name = formData.name.trim()
    const email = formData.email.trim().toLowerCase()

    if (!name || !email) {
      setError('Name and email are required.')
      return
    }

    try {
      setSaving(true)

      const updatedProfile = await updateAdminProfile({
        name,
        email,
      })

      // Update the logged-in user in AuthContext.
      updateUser(updatedProfile)

      setFormData({
        name: updatedProfile.name,
        email: updatedProfile.email,
      })

      setSuccess('Profile updated successfully!')
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to update profile. Please try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-100 p-3">
            <UserRound className="text-indigo-600" size={22} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Admin Profile
            </h2>
            <p className="text-sm text-gray-500">
              Update your personal account information.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            maxLength={100}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="Enter your email address"
          />
        </div>

        <div className="border-t border-gray-200 pt-5">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminProfileForm