import { useEffect, useState } from 'react'
import { Save, SlidersHorizontal, Image } from 'lucide-react'
import {
  getPlatformSettings,
  updatePlatformSettings,
} from '../../../services/adminSettingsService'

const initialFormData = {
  platformName: '',
  description: '',
  contactEmail: '',
  logoUrl: '',
  maintenanceMode: false,
}

const AdminPlatformSettings = () => {
  const [formData, setFormData] = useState(initialFormData)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        setError('')

        const settings = await getPlatformSettings()

        setFormData({
          platformName: settings.platformName || '',
          description: settings.description || '',
          contactEmail: settings.contactEmail || '',
          logoUrl: settings.logoUrl || '',
          maintenanceMode: settings.maintenanceMode ?? false,
        })
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Unable to load platform settings.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setFormData((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }))

    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    const payload = {
      ...formData,
      platformName: formData.platformName.trim(),
      description: formData.description.trim(),
      contactEmail: formData.contactEmail.trim().toLowerCase(),
      logoUrl: formData.logoUrl.trim(),
    }

    if (!payload.platformName || !payload.contactEmail) {
      setError('Platform name and contact email are required.')
      return
    }

    try {
      setSaving(true)

      const updatedSettings = await updatePlatformSettings(payload)

      setFormData({
        platformName: updatedSettings.platformName || '',
        description: updatedSettings.description || '',
        contactEmail: updatedSettings.contactEmail || '',
        logoUrl: updatedSettings.logoUrl || '',
        maintenanceMode: updatedSettings.maintenanceMode ?? false,
      })

      setSuccess('Platform settings updated successfully!')
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to update platform settings.'
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="py-12 text-center text-gray-500">
        Loading platform settings...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-indigo-100 p-3">
          <SlidersHorizontal className="text-indigo-600" size={22} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Platform Settings
          </h2>
          <p className="text-sm text-gray-500">
            Manage your learning platform's general configuration.
          </p>
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

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        <div>
          <label
            htmlFor="platformName"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Platform Name
          </label>

          <input
            id="platformName"
            name="platformName"
            type="text"
            value={formData.platformName}
            onChange={handleChange}
            maxLength={100}
            required
            placeholder="e.g. LearnHub"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Platform Description
          </label>

          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            maxLength={500}
            placeholder="Describe your learning platform..."
            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <p className="mt-1 text-right text-xs text-gray-400">
            {formData.description.length}/500 characters
          </p>
        </div>

        <div>
          <label
            htmlFor="contactEmail"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Contact Email
          </label>

          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={handleChange}
            required
            placeholder="support@example.com"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label
            htmlFor="logoUrl"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
          >
            <Image size={16} />
            Platform Logo URL
          </label>

          <input
            id="logoUrl"
            name="logoUrl"
            type="url"
            value={formData.logoUrl}
            onChange={handleChange}
            placeholder="https://example.com/logo.png"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          {formData.logoUrl && (
            <div className="mt-3">
              <p className="mb-2 text-xs text-gray-500">Logo preview</p>
              <img
                src={formData.logoUrl}
                alt="Platform logo preview"
                className="h-16 max-w-40 rounded-lg border border-gray-200 object-contain p-2"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-medium text-gray-800">
                Maintenance Mode
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Enable this when the platform needs maintenance.
              </p>
            </div>

            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={formData.maintenanceMode}
                onChange={handleChange}
                className="peer sr-only"
              />

              <div className="h-6 w-11 rounded-full bg-gray-300 transition peer-checked:bg-indigo-600 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" />
            </label>
          </div>

          {formData.maintenanceMode && (
            <p className="mt-3 text-sm text-amber-700">
              Maintenance mode is enabled in the saved settings.
            </p>
          )}
        </div>

        <div className="border-t border-gray-200 pt-5">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminPlatformSettings