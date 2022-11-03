import React, { useEffect } from 'react'
import { PageProps } from 'gatsby'

import { handbook } from '../../../sidebars/sidebars.json'

import SEO from 'components/seo'
import Layout from 'components/Layout'
import PostLayout, { SidebarSection } from 'components/PostLayout'
import { GitHub, LinkedIn, Twitter } from 'components/Icons'
import { Blockquote } from 'components/BlockQuote'
import { InlineCode } from 'components/InlineCode'
import { MdxCodeBlock } from 'components/CodeBlock'
import { ZoomImage } from 'components/ZoomImage'
import Link from 'components/Link'
import { Heading } from 'components/Heading'
import Markdown from 'markdown-to-jsx'
import { classNames } from 'lib/utils'
import { OrgProvider, UserProvider, useUser } from 'squeak-react'
import Modal from 'components/Modal'
import EditProfile from 'components/Profiles/EditProfile'

type SqueakProfile = {
    id: string
    first_name?: string
    last_name?: string
    avatar?: string

    biography?: string

    website?: string
    github?: string
    twitter?: string
    linkedin?: string

    company?: string
    company_role?: string

    team?: {
        name: string
        profiles: {
            id: string
            avatar?: string
            first_name?: string
            last_name?: string
            company_role?: string
        }[]
    }
}

const Avatar = (props: { className?: string; src?: string }) => {
    return (
        <div className={`overflow-hidden rounded-full ${props.className}`}>
            {props.src ? (
                <img className="w-full h-full" alt="" src={props.src} />
            ) : (
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M20.0782 41.0392H5.42978C4.03134 41.0392 3.1173 40.1642 3.09386 38.7736C3.07823 37.7814 3.07042 36.797 3.10948 35.8048C3.15636 34.6329 3.72668 33.7345 4.74228 33.1798C8.0782 31.3595 11.4299 29.5783 14.7659 27.7658C15.0081 27.633 15.1565 27.758 15.3362 27.8517C18.1878 29.3439 21.0942 29.4689 24.0626 28.2267C24.1485 28.1955 24.2423 28.1721 24.3126 28.1096C24.9298 27.5861 25.4845 27.7971 26.1251 28.1486C29.1173 29.7971 32.1331 31.4143 35.1487 33.0238C36.4534 33.7191 37.094 34.766 37.0706 36.2426C37.0549 37.0785 37.0706 37.9067 37.0706 38.7426C37.0628 40.1254 36.1409 41.0395 34.7659 41.0395H20.0783L20.0782 41.0392Z"
                        fill="#BFBFBC"
                    />
                    <path
                        d="M19.8359 27.0625C17.0859 26.9687 14.8047 25.6094 13.1251 23.1953C10.3751 19.2344 10.7032 13.6093 13.8516 10.0001C17.2735 6.08599 22.9452 6.10943 26.336 10.0469C29.9376 14.2345 29.711 20.8437 25.8126 24.6405C24.2188 26.1952 22.3126 27.0312 19.8362 27.0624L19.8359 27.0625Z"
                        fill="#BFBFBC"
                    />
                </svg>
            )}
        </div>
    )
}

export default function ProfilePage({ params }: PageProps) {
    const id = params.id

    const [profile, setProfile] = React.useState<SqueakProfile | undefined>(undefined)
    const [editModalOpen, setEditModalOpen] = React.useState(false)

    const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ')

    React.useEffect(() => {
        if (id) {
            fetch(`http://localhost:3000/api/profiles/${id}`)
                .then((res) => {
                    if (res.status === 404) {
                        throw new Error('not found')
                    }

                    return res.json()
                })
                .then((profile) => {
                    setProfile(profile)
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    }, [id])

    const handleEditProfile = (profile) => {
        setProfile(profile)
        setEditModalOpen(false)
    }

    return (
        <>
            <SEO title={`Community Profile - PostHog`} />
            <OrgProvider
                value={{ organizationId: '75421a23-0387-4418-8a6e-deddff8aefe8', apiHost: 'http://localhost:3000' }}
            >
                <Layout>
                    <UserProvider>
                        <Modal setOpen={setEditModalOpen} open={editModalOpen}>
                            <div
                                onClick={() => setEditModalOpen(false)}
                                className="flex flex-start justify-center absolute w-full p-4"
                            >
                                <div
                                    className="max-w-xl bg-white dark:bg-black rounded-md relative w-full p-5"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <EditProfile onSubmit={handleEditProfile} profile={profile} />
                                </div>
                            </div>
                        </Modal>
                        <PostLayout
                            title="Profile"
                            breadcrumb={[
                                { name: 'Community', url: '/questions' },
                                { name: 'Profile', url: `/community/profiles/${id}` },
                            ]}
                            menu={handbook}
                            sidebar={<ProfileSidebar setEditModalOpen={setEditModalOpen} profile={profile} />}
                            hideSurvey
                        >
                            {profile ? (
                                <div className="space-y-8 my-8">
                                    <section className="flex justify-between">
                                        <div className="space-y-3">
                                            <h1 className="m-0">{name || 'Anonymous'}</h1>
                                            {profile.company_role && (
                                                <p className="text-gray">{profile?.company_role}</p>
                                            )}
                                        </div>

                                        <Avatar className="w-24 h-24" src={profile.avatar} />
                                    </section>

                                    {profile?.biography && (
                                        <section>
                                            <h3>Biography</h3>

                                            <Markdown>{profile.biography}</Markdown>
                                        </section>
                                    )}
                                </div>
                            ) : null}
                        </PostLayout>
                    </UserProvider>
                </Layout>
            </OrgProvider>
        </>
    )
}

const ProfileSidebar = ({
    profile,
    setEditModalOpen,
}: {
    profile?: SqueakProfile
    setEditModalOpen: () => boolean
}) => {
    const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ')
    const { user } = useUser()

    return profile ? (
        <div>
            {profile.github || profile.twitter || profile.linkedin || profile.website ? (
                <SidebarSection title="Links">
                    <ul className="space-y-2 p-0">
                        {profile.website && (
                            <li className="flex items-center space-x-2">
                                <GitHub className="w-4 h-4" /> <a href="#">{profile.website}</a>
                            </li>
                        )}

                        {profile.github && (
                            <li className="flex items-center space-x-2">
                                <GitHub className="w-4 h-4" /> <a href="#">{profile.github}</a>
                            </li>
                        )}

                        {profile.twitter && (
                            <li className="flex items-center space-x-2">
                                <Twitter className="w-4 h-4" /> <a href="#">{profile.twitter}</a>
                            </li>
                        )}

                        {profile.linkedin && (
                            <li className="flex items-center space-x-2">
                                <LinkedIn className="w-4 h-4" /> <a href="#">{name}</a>
                            </li>
                        )}
                    </ul>
                </SidebarSection>
            ) : null}

            {profile.team ? (
                <>
                    <SidebarSection title="Team">
                        <span className="text-xl font-bold">{profile.team.name}</span>
                    </SidebarSection>

                    {profile.team.profiles.length > 0 ? (
                        <SidebarSection title="Co-workers">
                            <ul className="p-0">
                                {profile.team.profiles
                                    .filter(({ id }) => id !== profile.id)
                                    .map((profile) => {
                                        return (
                                            <div key={profile.id} className="flex items-center space-x-2">
                                                <Avatar className="w-8 h-8" src={profile.avatar} />
                                                <a href={`/community/profiles/${profile.id}`}>
                                                    {profile.first_name} {profile.last_name}
                                                </a>
                                            </div>
                                        )
                                    })}
                            </ul>
                        </SidebarSection>
                    ) : null}
                </>
            ) : null}

            {user?.profile?.id === profile.id && (
                <SidebarSection>
                    <button onClick={() => setEditModalOpen(true)} className="text-base text-red font-semibold">
                        Edit profile
                    </button>
                </SidebarSection>
            )}
        </div>
    ) : (
        <></>
    )
}
