import { useEffect, useState, useContext } from 'react';
import styles from './cardcomponents.module.css';
import downArrow from "../../assets/dropDown.png";
import editIcon from "../../assets/editIcon.png";
import { dotColor, taskActionList, visibleProgressType } from "../../Constant/dashboard";
import { beautifyDate, compareDates } from "../../utils/helper";
import CustomButton from '../ButtonComponent';
import DropdownBox from '../DropdownBox';
import CustomModal from '../customModal';
import LogoutDeleteModal from '../../Pages/PopUpModal/logoutDeleteModal';
import { AppContext } from '../../context/userContext';

const ActionComponent = ({taskInfo, onDeleteTask, id, onClickEdit}) => {

    const {userInfo} = useContext(AppContext);

    const [showActionDropDown, setShowActionDropDown] = useState(false);
    const [showDeleteModal,setShowDeleteModal] = useState(false);

    const [showCopyLinkBtn, setShowCopyLinkButton] = useState(false);
  
    const onCancel = () => {
        setShowDeleteModal(false);
    };

    return (
        <>
            {
                showCopyLinkBtn
                ? (
                    <CustomButton
                        title={"Link Copied"}
                        classes={`d-flex justify-center ${styles?.['copy-link-btn']}`}
                        buttonType={'outline'}
                    />
                )
                : null
            }
            <div
                className={`${styles["edit-icon"]}`}
                onClick={() => {
                    setShowActionDropDown((prev) => !prev);
                }}
            >
                <img src={editIcon} alt="editIcon" />
                <DropdownBox
                    optionsList={taskActionList(userInfo?._id !== taskInfo?.taskCreator)}
                    showDropdownBox={showActionDropDown}
                    onClick={(title) => {
                        if(title === "Edit") {
                            onClickEdit(taskInfo);
                        } else if(title === "Delete"){
                            setShowDeleteModal(true);
                        } else if (title === "Share") {
                            setShowCopyLinkButton(true);
                            setTimeout(() => {
                                window.open(`/shareTask/${id}`);
                                setShowCopyLinkButton(false);
                            }, 1000)
                        }
                    }}
                />
            </div>
            {
                showDeleteModal 
                ? <CustomModal>
                    <LogoutDeleteModal screen={'delete'} id={id} onClick={onDeleteTask} onCancel={onCancel} />
                </CustomModal>
                : null
            }
        </>
    );
};

const TaskComponent = ({task, slug, onDeleteTask, onClickPlusIcon, onUpdateTask, collapseAllTask}) => {
    const [showMoreTaskDetail, setShowMoreTaskDetail] = useState(false);

    useEffect(() => {
        if(collapseAllTask === false) {
            setShowMoreTaskDetail(false);
        }
    }, [collapseAllTask])

    return (
        <div className={`${styles['card-section']}`}>
            <div className={`d-flex align-center ${styles["card-header"]}`}>
                <div className={`d-flex align-center justify-center ${styles.priority}`}>
                    <span
                        className={`${styles["priority-dot"]}`}
                        style={{backgroundColor : dotColor[task?.priority]}}
                    >
                    </span>
                    <span className={`${styles["priority-text"]}`}>{task?.priority}</span>
                    {
                        task?.assignedto 
                        ? <div className={`${styles.assignee}`}>{task?.assignedto.slice(0,2).toUpperCase()}</div>
                        : null
                    }
                </div>

                <ActionComponent
                    taskInfo={task}
                    onDeleteTask={onDeleteTask}
                    id={task?._id}
                    onClickEdit={onClickPlusIcon}
                />
            </div>

            <h2 className={styles['task-title']}>{task?.title}</h2>

            <div className={`d-flex align-center ${styles.checklist}`}>
                Checklist ({task?.checkList?.filter((item) => item?.checked).length}/{task?.checkList?.length})
                <div
                    className={`cursor-pointer ${styles["dropdown-btn"]}`}
                    onClick={()=>{
                        setShowMoreTaskDetail((prev)=>!prev);
                    }}
                >
                    <img src={downArrow} alt="downArrowIcon" />
                </div>
            </div>

            <div className={`${styles['check-list-detail']} ${showMoreTaskDetail ? styles['show-info'] : ''}`}>
                {
                    task?.checkList.map((checklist) => {
                        return (
                            <div key={checklist?._id} className={`d-flex align-center ${styles['checklist-items']}`}>
                                <input
                                    type="checkbox"
                                    name={checklist?.checklistAdded}
                                    id={checklist?.checklistAdded}
                                    checked = {checklist?.checked}
                                    onChange= {()=>{
                                        onUpdateTask(
                                            task,
                                            { checklist },
                                        )
                                    }}
                                    className={styles['checklist-status']}
                                />
                                <label
                                    htmlFor={checklist?.checklistAdded}
                                    className={styles['checklist-text']}
                                >
                                    {checklist?.checklistAdded}
                                </label>
                            </div>
                        )
                    })
                }
            </div>

            <div className={`d-flex align-center ${styles["card-footer"]}`}>
                {
                    (task?.dueDate && task?.dueDate !== "")
                    ? (
                        <div
                            className={`${styles["due-date"]}`}
                            style={
                                {
                                    backgroundColor : task?.progress === "DONE"
                                                    ? "#63C05B" 
                                                    : compareDates(task?.dueDate) ? "#CF3636" : "#DBDBDB" ,
                                    color : (task?.progress === "DONE" || compareDates(task?.dueDate)) ? "#FFFFFF" : "#5A5A5A"
                                }
                            }
                        >
                            { beautifyDate(task?.dueDate) }
                        </div>
                    ) 
                    : (
                        <div className={`${styles['empty-div']}`}></div>
                    )
                }
                <div className={`${styles["status-buttons"]}`}>
                    {
                        visibleProgressType(slug).map((visibleType)=>{
                            return (
                                <CustomButton
                                    title={visibleType?.title}
                                    classes={`${styles["status-btn"]}`}
                                    key={visibleType.id}
                                    onClick={() => {
                                        onUpdateTask(
                                            task,
                                            { progressType : visibleType?.title }
                                        );
                                    }}
                                />
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
};

export default TaskComponent;