import { ReactNode, SyntheticEvent, useState } from 'react'
import Head from 'next/head'
import { Box, Button, Tab, Tabs, Typography } from '@mui/material'
import { TreeView, TreeItem } from '@mui/lab'
import { Info, QuestionAnswer, ExpandMore, ChevronRight } from '@mui/icons-material'
import { useAlert } from 'hooks/AlertHook'
import { useConfirm } from 'hooks/ConfirmHook'

interface ITabPanelProps {
  children?: ReactNode
  index: number
  value: number
}

interface ITreeViewNode<T> {
  id: string
  text: string
  obj?: T
  parent?: ITreeViewNode<T>
  childs: ITreeViewNode<T>[]
}

const TabPanel = (props: ITabPanelProps) => {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

const a11yProps = (index: number) => {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`
  }
}

const Components = () => {
  const [tabNum, setTabNum] = useState(0)
  const [openAlertDialog, renderAlertDialog] = useAlert()
  const [openConfirmDialog, renderConfirmDialog] = useConfirm()
  const [confirmAnswer, setConfirmAnswer] = useState<boolean>()
  const nodes: ITreeViewNode<string>[] = [
    {
      id: 'obj1',
      text: 'obj1',
      childs: [
        {
          id: 'obj1-1',
          text: 'obj1-1',
          childs: [
            {
              id: 'obj1-1-1',
              text: 'obj1-1-1',
              childs: []
            },
            {
              id: 'obj1-1-2',
              text: 'obj1-1-2',
              childs: []
            }
          ]
        },
        {
          id: 'obj1-2',
          text: 'obj1-2',
          childs: []
        }
      ]
    },
    {
      id: 'obj2',
      text: 'obj2',
      childs: [
        {
          id: 'obj2-1',
          text: 'obj2-1',
          childs: []
        },
        {
          id: 'obj2-2',
          text: 'obj2-2',
          childs: [
            {
              id: 'obj2-2-1',
              text: 'obj2-2-1',
              childs: []
            }
          ]
        }
      ]
    }
  ]

  // タブ選択時
  const handleChangeTabNum = (_event: SyntheticEvent, newTabNum: number) => {
    setTabNum(newTabNum)
  }

  // 再帰でtreeを描画
  const renderTreeViewFromNodes = <T,>(nodes: ITreeViewNode<T>[]) => (
    <>
      {nodes.map((node) => (
        <TreeItem nodeId={node.id} label={node.text} key={node.id}>
          {node.childs.length > 0 && <>{renderTreeViewFromNodes(node.childs)}</>}
        </TreeItem>
      ))}
    </>
  )

  return (
    <>
      <Head>
        <title>components</title>
      </Head>
      <h1>Components</h1>
      <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex' }}>
        <Tabs
          value={tabNum}
          onChange={handleChangeTabNum}
          variant="scrollable"
          aria-label="scrollable auto tabs example"
          orientation="vertical"
          sx={{ borderRight: 1, borderColor: 'divider' }}
          scrollButtons
          allowScrollButtonsMobile
        >
          <Tab label="Dialog" {...a11yProps(0)} />
          <Tab label="Tree View" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
        </Tabs>
        <TabPanel value={tabNum} index={0}>
          <h1>Dialog</h1>
          <Box>
            <Button
              sx={{ mr: 1 }}
              variant="contained"
              onClick={async () => {
                await openAlertDialog('Alert', 'Text')
              }}
              startIcon={<Info />}
            >
              Alert
            </Button>
          </Box>
          <Box sx={{ marginTop: 1 }}>
            <Button
              sx={{ mr: 1 }}
              variant="contained"
              onClick={async () => {
                setConfirmAnswer(await openConfirmDialog('Comfirm', 'Are you sure???'))
              }}
              startIcon={<QuestionAnswer />}
            >
              Confirm
            </Button>
            Answer is: {confirmAnswer === true ? 'YES' : 'NO'}
          </Box>
        </TabPanel>
        <TabPanel value={tabNum} index={1}>
          <h1>Tree View</h1>
          <TreeView
            aria-label="file system navigator"
            defaultCollapseIcon={<ExpandMore />}
            defaultExpandIcon={<ChevronRight />}
            sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
          >
            {renderTreeViewFromNodes(nodes)}
          </TreeView>
        </TabPanel>
        <TabPanel value={tabNum} index={2}>
          Item Three
        </TabPanel>
      </Box>
      {renderAlertDialog()}
      {renderConfirmDialog()}
    </>
  )
}

export default Components
