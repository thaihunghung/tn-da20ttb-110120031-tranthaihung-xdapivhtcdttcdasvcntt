import React, { useState, useEffect } from 'react';
import { Button, Input, Avatar } from '@nextui-org/react';
import { axiosAdmin } from '../../../../../../service/AxiosAdmin';
import { useParams } from 'react-router-dom';
import { storage } from '../../../../../../service/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const TeacherProfile = (props) => {
  const { setCollapsedNav, successNoti } = props;
  const [profile, setProfile] = useState({
    name: '',
    teacherCode: '',
    email: '',
    permission: '',
    permissionName: '',
    typeTeacher: '',
    imgURL: null
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosAdmin.get(`teacher/${id}`);
        const data = response.data;
        console.log(data);
        setProfile({
          name: data.teachers.name,
          teacherCode: data.teachers.teacherCode,
          email: data.teachers.email,
          permission: data.teachers.permission,
          permissionName: data.permissionName,
          typeTeacher: data.teachers.typeTeacher,
          imgURL: data.teachers.imgURL
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = async () => {
    try {
      let imgURL = profile.imgURL;
      if (newImage) {
        const timestamp = new Date().getTime();
        const storageRef = ref(storage, `avatars/${id}_${timestamp}_${newImage.name}`);
        await uploadBytes(storageRef, newImage);
        imgURL = await getDownloadURL(storageRef);
      }

      const updatedProfile = { ...profile, imgURL };

      console.log("vvv", updatedProfile)
      await axiosAdmin.put(`teacher/${id}`,{ data: updatedProfile });
      setProfile(updatedProfile);
      setIsEditing(false);
      console.log('Profile saved', updatedProfile);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewImage(null);
    console.log('Profile edit cancelled');
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(file);
        setProfile({ ...profile, imgURL: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsedNav(true);
      } else {
        setCollapsedNav(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="p-16">
      <div className="p-8 bg-white shadow mt-24">
        <div className="flex flex-col justify-center">
          <div className="relative items-center justify-center">
            <div className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-36 flex items-center justify-center text-indigo-500">
              <Avatar
                showFallback
                src={profile.imgURL || 'https://images.unsplash.com/broken'}
                fallback={<i className="fa-solid fa-arrow-up-from-bracket"></i>}
                className="w-40 h-40 mx-auto rounded-full"
              />
            </div>
          </div>
          <div>
            {isEditing && (
              <div>
                <input
                  className="mt-20"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col mt-20 text-left border-b pb-12 gap-3">
          <h1 className="text-4xl font-medium text-center text-gray-700">
            {profile.name}
          </h1>
          <h1 className="text-3xl font-medium text-gray-700 ml-28">
            Email: <span className="font-light text-gray-500">{profile.email}</span>
          </h1>
          <h1 className="text-3xl font-medium text-gray-700 ml-28">
            Mã giáo viên: <span className="font-light text-gray-500">{profile.teacherCode}</span>
          </h1>
          <h1 className="text-3xl font-medium text-gray-700 ml-28">
            Mã giáo viên: <span className="font-light text-gray-500">{profile.permissionName}</span>
          </h1>
        </div>
        <div className="space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center">
          {!isEditing && (
            <Button icon={<i className="fas fa-edit"></i>} onClick={() => setIsEditing(true)}
              className="mt-4 bg-blue-500 text-white"
            >
              Edit
            </Button>
          )}
        </div>
        
        {isEditing && (
          <div className="flex gap-4 justify-center mt-6">
            <Button onClick={handleSave} className="bg-blue-500 text-white">Save</Button>
            <Button onClick={handleCancel} className="bg-red-500 text-white">Cancel</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherProfile;
