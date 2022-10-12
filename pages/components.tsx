import { ReactNode, Suspense, SyntheticEvent, useState } from 'react'
import Head from 'next/head'
import { Box, Button, CircularProgress, Container, List, ListItem, ListItemText, Tab, Tabs } from '@mui/material'
import { TreeView, TreeItem } from '@mui/lab'
import { Info, QuestionAnswer, ExpandMore, ChevronRight } from '@mui/icons-material'
import { useAlert } from 'hooks/AlertHook'
import { useConfirm } from 'hooks/ConfirmHook'
import { useData } from 'hooks/FetchData'

interface TabPanelProps {
  children?: ReactNode
  index: number
  value: number
}

interface NodeTreeView<T> {
  id: string
  text: string
  obj?: T
  parent?: NodeTreeView<T>
  childs: NodeTreeView<T>[]
}

interface NodeTreeViewProps<T> {
  nodes: NodeTreeView<T>[]
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props

  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && (
        <Container>
          <Box sx={{ p: 3 }}>{children}</Box>
        </Container>
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

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const fetchData = async () => {
  await sleep(5000)
  return ['a', 'b', 'c']
}

const Components = () => {
  const [tabNum, setTabNum] = useState(0)
  const [openAlertDialog, renderAlertDialog] = useAlert()
  const [openConfirmDialog, renderConfirmDialog] = useConfirm()
  const [confirmAnswer, setConfirmAnswer] = useState<boolean>(false)
  const [data, setData] = useState<string[] | undefined>(undefined)

  const nodes: NodeTreeView<string>[] = [
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
  const TreeViewFromNodes = <T,>(props: NodeTreeViewProps<T>) => {
    const { nodes } = props

    return (
      <>
        {nodes.map((node) => (
          <TreeItem nodeId={node.id} label={node.text} key={node.id}>
            {node.childs.length > 0 && <TreeViewFromNodes nodes={node.childs} />}
          </TreeItem>
        ))}
      </>
    )
  }

  const HeavyList = () => {
    const list = useData<string[] | undefined>(
      data,
      fetchData().then((d) => setData(d))
    )
    return (
      <List dense>
        {list?.map((item, index) => (
          <ListItem key={index}>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    )
  }

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
          <Tab label="Heavy Process" {...a11yProps(2)} />
        </Tabs>
        <TabPanel value={tabNum} index={0}>
          <h2>Dialog</h2>
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
          <h2>Tree View</h2>
          <TreeView
            aria-label="file system navigator"
            defaultCollapseIcon={<ExpandMore />}
            defaultExpandIcon={<ChevronRight />}
            sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
          >
            <TreeViewFromNodes nodes={nodes} />
          </TreeView>
        </TabPanel>
        <TabPanel value={tabNum} index={2}>
          <h2>Heavy Process</h2>
          <Box>
            <Button
              variant="contained"
              sx={{ mb: 2 }}
              onClick={() => {
                setData(undefined)
              }}
            >
              Reset
            </Button>
          </Box>
          <Suspense fallback={<CircularProgress color="inherit" />}>
            <HeavyList />
          </Suspense>
        </TabPanel>
      </Box>
      {renderAlertDialog()}
      {renderConfirmDialog()}
    </>
  )
}

export default Components
