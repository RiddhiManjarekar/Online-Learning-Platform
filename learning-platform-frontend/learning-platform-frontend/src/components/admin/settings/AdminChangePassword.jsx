import { useState } from 'react'
import { Eye, EyeOff, LockKeyhole, Save } from 'lucide-react'
import { changeAdminPassword } from '../../../services/adminSettingsService'

const AdminChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))

    setError('')
    setSuccess('')
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords((previous) => ({
      ...previous,
      [field]: !previous[field],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    if (formData.newPassword.length < 8) {
      setError('New password must contain at least 8 characters.')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New password and confirm password do not match.')
      return
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('New password must be different from your current password.')
      return
    }

    try {
      setSaving(true)

      const response = await changeAdminPassword(formData)

      setSuccess(response.message || 'Password changed successfully!')

      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to change password. Please check your current password.'
      )
    } finally {
      setSaving(false)
    }
  }

  const passwordFields = [
    {
      name: 'currentPassword',
      label: 'Current Password',
      visibilityKey: 'current',
      placeholder: 'Enter current password',
    },
    {
      name: 'newPassword',
      label: 'New Password',
      visibilityKey: 'new',
      placeholder: 'Enter new password',
    },
    {
      name: 'confirmPassword',
      label: 'Confirm New Password',
      visibilityKey: 'confirm',
      placeholder: 'Re-enter new password',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-indigo-100 p-3">
          <LockKeyhole className="text-indigo-600" size={22} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Change Password
          </h2>
          <p className="text-sm text-gray-500">
            Update your password to keep your account secure.
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

      <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
        {passwordFields.map((field) => (
          <div key={field.name}>
            <label
              htmlFor={field.name}
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              {field.label}
            </label>

            <div className="relative">
              <input
                id={field.name}
                name={field.name}
                type={showPasswords[field.visibilityKey] ? 'text' : 'password'}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                required
                minLength={field.name === 'newPassword' ? 8 : undefined}
                maxLength={field.name === 'newPassword' ? 72 : undefined}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              <button
                type="button"
                onClick={() => togglePasswordVisibility(field.visibilityKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={
                  showPasswords[field.visibilityKey]
                    ? 'Hide password'
                    : 'Show password'
                }
              >
                {showPasswords[field.visibilityKey] ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>
        ))}

        <p className="text-xs text-gray-500">
          Your new password must contain at least 8 characters.
        </p>

        <div className="border-t border-gray-200 pt-5">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />
            {saving ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminChangePassword