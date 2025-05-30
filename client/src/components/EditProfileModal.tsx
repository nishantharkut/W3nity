import React, { useState, useEffect } from "react";
import { User } from "@/types";
interface Props {
  user: User;
  onClose: () => void;
  onSave: (updatedData: User) => void;
}

const EditProfileModal: React.FC<Props> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState<User>(user);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name, value, type, checked } = e.target;

  if (name === "skills" || name === "socialLinks") {
    setFormData({
      ...formData,
      [name]: value.split(",").map((item) => item.trim()),
    });
  } else if (name === "rating" || name === "reviewCount") {
    setFormData({
      ...formData,
      [name]: Number(value),
    });
  } else if (type === "checkbox") {
    setFormData({
      ...formData,
      [name]: checked,
    });
  } else {
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  if (errors[name]) {
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }
};


  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (
      formData.role === "client" &&
      formData.companyName &&
      formData.companyName.trim().length < 3
    ) {
      newErrors.companyName = "Company Name must be at least 3 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${formData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      console.log(response);
      const updatedUser = await response.json();
      onSave(updatedUser);
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl shadow-xl max-w-3xl w-full p-8 overflow-auto max-h-[90vh] text-gray-100 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        <h2 className="text-4xl font-bold mb-8 text-blue-500 tracking-wide">
          Edit Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block mb-2 font-semibold text-gray-300"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className={`w-full rounded-lg border ${
                errors.username ? "border-red-500" : "border-gray-700"
              } bg-gray-800 p-3 text-gray-100 placeholder-gray-500 transition focus:outline-none focus:ring-2 focus:ring-blue-600`}
              placeholder="Your username"
            />
            {errors.username && (
              <p className="mt-1 text-red-500 text-sm">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-2 font-semibold text-gray-300"
            >
              Email (cannot be changed)
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="block mb-2 font-semibold text-gray-300"
            >
              Location
            </label>
            <input
              id="location"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-gray-100 placeholder-gray-500 transition focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Your location"
            />
          </div>

          {/* Avatar URL */}
          <div>
            <label
              htmlFor="avatar"
              className="block mb-2 font-semibold text-gray-300"
            >
              Avatar URL
            </label>
            <input
              id="avatar"
              type="url"
              name="avatar"
              value={formData.avatar || ""}
              onChange={handleChange}
              placeholder="https://example.com/avatar.jpg"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-gray-100 placeholder-gray-500 transition focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Bio */}
          <div>
            <label
              htmlFor="bio"
              className="block mb-2 font-semibold text-gray-300"
            >
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio || ""}
              onChange={handleChange}
              rows={4}
              placeholder="Write a short bio..."
              className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-gray-100 placeholder-gray-500 resize-y transition focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Role */}
          <div>
            <label
              htmlFor="role"
              className="block mb-2 font-semibold text-gray-300"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-gray-100 transition focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="freelancer">Freelancer</option>
              <option value="client">Client</option>
              <option value="organizer">Organizer</option>
            </select>
          </div>

          {/* Conditional fields for client */}
          {formData.role === "client" && (
            <>
              <div>
                <label
                  htmlFor="companyName"
                  className="block mb-2 font-semibold text-gray-300"
                >
                  Company Name
                </label>
                <input
                  id="companyName"
                  type="text"
                  name="companyName"
                  value={formData.companyName || ""}
                  onChange={handleChange}
                  className={`w-full rounded-lg border ${
                    errors.companyName ? "border-red-500" : "border-gray-700"
                  } bg-gray-800 p-3 text-gray-100 placeholder-gray-500 transition focus:outline-none focus:ring-2 focus:ring-blue-600`}
                  placeholder="Your company name"
                />
                {errors.companyName && (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.companyName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="clientSince"
                  className="block mb-2 font-semibold text-gray-300"
                >
                  Client Since
                </label>
                {/* <input
                  id="clientSince"
                  type="date"
                  name="clientSince"
                  value={
                    formData?.clientSince
                  }
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-gray-100 placeholder-gray-500 transition focus:outline-none focus:ring-2 focus:ring-blue-600"
                /> */}
              </div>

              <div>
                <label
                  htmlFor="skills"
                  className="block mb-2 font-semibold text-gray-300"
                >
                  Skills (comma separated)
                </label>
                <input
                  id="skills"
                  type="text"
                  name="skills"
                  value={(formData.skills || []).join(", ")}
                  onChange={handleChange}
                  placeholder="e.g. JavaScript, React, Node"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-gray-100 placeholder-gray-500 transition focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label
                  htmlFor="socialLinks"
                  className="block mb-2 font-semibold text-gray-300"
                >
                  Social Links (comma separated)
                </label>
                <input
                  id="socialLinks"
                  type="text"
                  name="socialLinks"
                  value={(formData.socialLinks || []).join(", ")}
                  onChange={handleChange}
                  placeholder="e.g. linkedin.com/in/username, twitter.com/username"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-gray-100 placeholder-gray-500 transition focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="flex space-x-4 mt-2">
                <div>
                  <label className="block mb-1 font-semibold text-gray-300">
                    Rating
                  </label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating ?? 0}
                    onChange={handleChange} // add this
                    disabled={formData.role !== "client"}
                    className={`w-20 rounded-lg border p-2 text-center ${
                      formData.role === "client"
                        ? "border-gray-700 bg-gray-800 text-gray-100"
                        : "border-gray-600 bg-gray-700 text-gray-400 cursor-not-allowed"
                    }`}
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold text-gray-300">
                    Reviews
                  </label>
                  <input
                    type="number"
                    name="reviewCount"
                    value={formData.reviewCount ?? 0}
                    onChange={handleChange} // add this
                    disabled={formData.role !== "client"} // disable if not client
                    className={`w-20 rounded-lg border p-2 text-center ${
                      formData.role === "client"
                        ? "border-gray-700 bg-gray-800 text-gray-100"
                        : "border-gray-600 bg-gray-700 text-gray-400 cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>
            </>
          )}

          {/* Verified checkbox */}
          <div className="flex items-center space-x-3 mt-6">
            <input
              type="checkbox"
              name="isVerified"
              checked={formData.isVerified || false}
              onChange={handleChange}
              id="isVerified"
              className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-600 cursor-pointer"
            />
            <label
              htmlFor="isVerified"
              className="font-semibold text-gray-300 select-none cursor-pointer"
            >
              Verified
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
